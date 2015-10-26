/// <reference path="../../../typings/tsd.d.ts" />
import RamlWrapper    = require('../../Raml08Wrapper');

/**
 * Created by kor on 23/05/15.
 */

enum StatusCode{
    OK,WARNING,ERROR,UNKNOWN,CANCELLED
}

interface Status{
    code:StatusCode
    message:string
}

interface ParameterValidator{
    (v:any,p:RamlWrapper.Param):Promise<Status>
}
interface MethodValidator {
    (req:har.Request,m:RamlWrapper.Method,history?:har.Request[]):Promise<Status>
}
interface Proposal{
    replacementString:string;
    offset:number;
    replaceLength:number;
    displayName:string
    icon:string
}

interface ProposalAcceptor{
    accept()
}
export interface ValueProposalComputer{
    compute(v:string,offset:number,p:RamlWrapper.Param,acceptor:ProposalAcceptor);
}
export interface BodyProposalComputer{
    compute(v:string,offset:number,p:RamlWrapper.Param,acceptor:ProposalAcceptor);
}
