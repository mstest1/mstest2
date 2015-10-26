/// <reference path="../../../typings/tsd.d.ts" />
import RamlWrapper    = require('../../Raml08Wrapper');
import Sys=require("./systemTypes")
enum StatusCode{
    OK,WARNING,ERROR,UNKNOWN,CANCELLED
}
interface Status{
    code:StatusCode
    message:string
}
/**
 * should be serializable and restorable easily
 */
interface AuthentificationState{
    /**
     * authentification specific storage of data
     */
    [name:string]:any

    /**
     * allows to test if method can be accessed
     * @param req
     */
    testAccessControl(req:har.Request):Status


    testAccessControl(method:RamlWrapper.Method):Status

    status():Status;

    schemeId():string
}
interface AuthentificationParameters{
    [parName:string]:any
}
interface AuthData{
    api():RamlWrapper.Api
    apiUrl():string;
    authentificationParameters:AuthentificationParameters
}
interface ParameterSpec {
    name():string
    required():boolean;
    /**
     * more stuff should be here (same as in raml parameters)
     */
}
interface PromptSpec{
    name():string
    description():string
    toPrompt():ParameterSpec[];
}
interface UserResponse{
    [parName:string]:any
    isCancelled():boolean
}
interface QueryListener{
    (r:har.Request):har.Response
}
interface EndPoint{
    endpointUrl():string
    addListener(listener:QueryListener);
    removeListener(listenr:QueryListener);
}
interface EndPointSpec{
    url:string
    needToSendResponse:boolean;
}

interface SecurityEnvironment{

    /**
     * execute authentification step to external service
     * @param reg
     */
    executeHTTPRequest(reg:har.Request):Promise<har.Response>


    /**
     * asks for extra parameters( stored in cfg file or asked in dialog)
     * @param parameterSpec
     */
    askForExtraData(parameterSpec:PromptSpec):Promise<UserResponse>


    // create
    getOrCreateEndPoint(EndPointSpec):Promise<EndPoint>

    hasEndpoints():boolean;
    isInteractive():boolean;
    isGraphical():boolean
}

interface AuthentificationManager{

    supports(client:SecurityEnvironment):boolean;

    /**
     * performs authentification
     * everything may happen here even sending horse rider to a new city
     * or flight to moon
     * @param env
     */
    doAuth(env:SecurityEnvironment,authData:AuthData):Promise<AuthentificationState>

    /**
     * performs log out
     * if it is needed to blow a nuke to logout it is possible
     * @param env
     */
    doLogout(env:SecurityEnvironment,authData:AuthentificationState):Promise<AuthentificationState>


    /**
     * performs arbitrary request transform (as a sample might change actual url)
     * or do complex encoding
     * @param req
     */
    addAuthDataToRequest(req:har.Request,state:AuthentificationState):Promise<har.Response>
}
interface SchemeInfo{
    parameterSpec:ParameterSpec[]
    name():string
    description():string
}
interface SecurityScheme{

    info():SchemeInfo
    id():string
    needsEndpoints():boolean;
    isInteractive():boolean;
    /***
     * means that you potentially need to have graphical display to pass it
     */
    isGraphical():boolean

    createAuthManager():AuthentificationManager;
}

interface SecurityAwareApiClient{
    api():RamlWrapper.Api

    securitySchemes():SecurityScheme[]

    getOrCreateAuthManager(s:SecurityScheme):AuthentificationManager

    doAuth(scheme:SecurityScheme):Promise<AuthentificationState>
    doAuthSync(scheme:SecurityScheme):AuthentificationState



    setCurrentAuthData(state:AuthentificationState);//needed for multiple users
    getCurrentAuthData():AuthentificationState
}
/**
 * hook for providing custom security scheme to client environments
 */
export interface SecuritySchemeHook{
    ():SecurityScheme
}