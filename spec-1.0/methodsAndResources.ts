import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  Params=require("./parameters")
import  Bodies=require("./bodies")
import  Common=require("./common")
import  Declarations=require("./declarations")
import models=require("./datamodel")
import  auth=require("./auth")
///////////////////////////////////////////////////////////
//Resources  methods and Api, demonstrate setting context values a bit

export class ResourceTypeRef extends Sys.Reference<ResourceType>{

}

export class TraitRef extends Sys.Reference<Trait>{

}
export class SecuritySchemaPart extends MethodBase {

    $=[MetaModel.issue("Specification is actually very vague here")]
}

class SecuritySchemaHook{
    $=[MetaModel.description("Allows customization of security schemeas")]
    parameters:models.DataElement[];
    script:SecuritySchemaHookScript
}

class SecuritySchemaHookScript extends Sys.ScriptingHook<auth.SecuritySchemeHook>{

}

export class SecuritySchemaType extends Common.RAMLLanguageElement{

    requiredSettings:models.DataElement[];
    $requiredSettings=[MetaModel.description("You may declare settings needed to use this type of security security schemas"),
        MetaModel.setsContextValue("locationKind",models.LocationKind.DECLARATIONS),
        MetaModel.declaringFields()]

    describedBy:SecuritySchemaPart;
    $describedBy=[MetaModel.description(`The describedBy attribute MAY be used to apply a trait-like structure to a security scheme mechanism so as to extend the mechanism, such as specifying response codes, HTTP headers or custom documentation.
        This extension allows API designers to describe security schemes. As a best practice, even for standard security schemes, API designers SHOULD describe the security schemes' required artifacts, such as headers, URI parameters, and so on. Including the security schemes' description completes an API's documentation.`)]

    $=[MetaModel.declaresSubTypeOf("SecuritySchemaSettings"),MetaModel.description("Security schema type allows you to contribute your own security schema type with settings and optinal configurator for " +
    "plugging into client sdks auth mechanism")]
}

export class SecuritySchemaSettings extends Common.RAMLLanguageElement{

    //TODO FILL OATH1, OATH2 requirements
    $=[MetaModel.issue("Specification is actually very vague here"),MetaModel.functionalDescriminator("$parent.type")]//FIXME

    authentificationConfigurator:SecuritySchemaHook
    $authentificationConfigurator=[MetaModel.description("You may provide custom code to handle authentification here")]

}
export class OAuth1SecuritySchemaSettings extends  SecuritySchemaSettings{
    $=[MetaModel.functionalDescriminator("$parent.type=='OAuth 1.0'"),MetaModel.issue("Specification is actually very vague here")]

    requestTokenUri:Sys.FixedUri
    $requestTokenUri=[MetaModel.required(),MetaModel.description("The URI of the Temporary Credential Request endpoint as defined in RFC5849 Section 2.1")]

    authorizationUri:Sys.FixedUri
    $authorizationUri=[MetaModel.required(),MetaModel.description("The URI of the Resource Owner Authorization endpoint as defined in RFC5849 Section 2.2")]

    tokenCredentialsUri:Sys.FixedUri
    $tokenCredentialsUri=[MetaModel.required(),MetaModel.description("The URI of the Token Request endpoint as defined in RFC5849 Section 2.3")]

    signatures: string[]
    $signatures=[MetaModel.oneOf(["HMAC-SHA1","RSA-SHA1","PLAINTEXT"])]
}
export class OAuth2SecuritySchemeSettings extends  SecuritySchemaSettings{
    $=[MetaModel.functionalDescriminator("$parent.type=='OAuth 2.0'"),MetaModel.issue("Specification is actually very vague here")]

    accessTokenUri:Sys.FixedUri
    $accessTokenUri=[MetaModel.required(),MetaModel.description("The URI of the Token Endpoint as defined in RFC6749 [RFC6748] Section 3.2")]

    authorizationUri:Sys.FixedUri
    $authorizationUri=[MetaModel.required(),MetaModel.description("The URI of the Authorization Endpoint as defined in RFC6749 [RFC6748] Section 3.1")]

    authorizationGrants:string[]
    $authorizationGrants=[MetaModel.required(),MetaModel.description("A list of the Authorization grants supported by the API As defined in RFC6749 [RFC6749] Sections 4.1, 4.2, 4.3 and 4.4, can be any of: code, token, owner or credentials.")]

    scopes:string[]
    $scopes=[MetaModel.description("A list of scopes supported by the API as defined in RFC6749 [RFC6749] Section 3.3")]
}
export class APIKeySettings extends  SecuritySchemaSettings{
    $=[MetaModel.functionalDescriminator("$parent.type=='APIKey'"),MetaModel.issue("Specification is actually very vague here")]


    queryParameterName:string
    headerName:string

}




export class SecuritySchemaRef extends Sys.Reference<SecuritySchema>{

}

export class SecuritySchema extends Common.RAMLLanguageElement implements Sys.Referencable<SecuritySchema> {
    name:string
    $name=[MetaModel.key(),MetaModel.startFrom("")]

    type:string
    $type=[MetaModel.oneOf(["OAuth 1.0","OAuth 2.0","Basic Authentication","Digest Authentication","APIKey","x-{other}"]),
        MetaModel.descriminatingProperty(),//FIXME (we need more clear connection with SecuritySchemaType)
        MetaModel.description(
        "The securitySchemes property MUST be used to specify an API's security mechanisms, including the required settings and the authentication methods that the API supports. one authentication method is allowed if the API supports them."
    )]

    description:Sys.MarkdownString;
    $description=[MetaModel.description("The description attribute MAY be used to describe a securitySchemes property.")]

    describedBy:SecuritySchemaPart;
    $describedBy=[MetaModel.description(`The describedBy attribute MAY be used to apply a trait-like structure to a security scheme mechanism so as to extend the mechanism, such as specifying response codes, HTTP headers or custom documentation.
        This extension allows API designers to describe security schemes. As a best practice, even for standard security schemes, API designers SHOULD describe the security schemes' required artifacts, such as headers, URI parameters, and so on. Including the security schemes' description completes an API's documentation.`)]

    settings:SecuritySchemaSettings;
    $settings=[MetaModel.description(`The settings attribute MAY be used to provide security schema-specific information. Depending on the value of the type parameter, its attributes can vary.
        The following lists describe the minimum set of properties which any processing application MUST provide and validate if it chooses to implement the Security Scheme type. Processing applications MAY choose to recognize other properties for things such as token lifetime, preferred cryptographic algorithms, an so on.`)]

    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]
}
class Oath2 extends SecuritySchema{
    type="OAuth 2.0"
    settings:OAuth2SecuritySchemeSettings

    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]

}
class Oath1 extends SecuritySchema{
    type="OAuth 1.0"
    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]
    settings: OAuth1SecuritySchemaSettings
}
class APIKey extends SecuritySchema{
    type="APIKey"
    settings:APIKeySettings

    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]

}
class Basic extends SecuritySchema{
    type="Basic Authentication"
    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]

}
class Digest extends SecuritySchema{
    type="Digest Authentication"
    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]

}
class Custom extends SecuritySchema{
    type="x-{other}"
    $=[MetaModel.description("Declares globally referancable security schema definition"),MetaModel.actuallyExports("$self"),MetaModel.referenceIs("settings")]

}
export class MethodBase extends Params.HasNormalParameters{

    responses:Bodies.Response[]
    $responses=[MetaModel.setsContextValue("response","true"), MetaModel.newInstanceName("New Response"),MetaModel.description(`Resource methods MAY have one or more responses. Responses MAY be described using the description property, and MAY include example attributes or schema properties.
`)]

    body:models.DataElement[]
    $body=[MetaModel.newInstanceName("New Body"),MetaModel.description(`Some method verbs expect the resource to be sent as a request body. For example, to create a resource, the request must include the details of the resource to create.
Resources CAN have alternate representations. For example, an API might support both JSON and XML representations.
A method's body is defined in the body property as a hashmap, in which the key MUST be a valid media type.`),MetaModel.needsClarification("Ensure that forms spec is consistent with it")]

    protocols:string[]
    $protocols=[MetaModel.oneOf(["HTTP","HTTPS"]),
        MetaModel.issue("Not clear how it should work in combination with baseUri also is it also related to resources and types/traits"),MetaModel.needsClarification("Actually it is a set"),
        MetaModel.description("A method can override an API's protocols value for that single method by setting a different value for the fields.")]


    is:TraitRef[]
    securedBy:SecuritySchemaRef[]
    $securedBy=[

        MetaModel.allowNull(),
        MetaModel.description(` securityScheme may also be applied to a resource by using the securedBy key, which is equivalent to applying the securityScheme to all methods that may be declared, explicitly or implicitly, by defining the resourceTypes or traits property for that resource.
To indicate that the method may be called without applying any securityScheme, the method may be annotated with the null securityScheme.`)]
    $is=[MetaModel.description("Instantiation of applyed traits"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

}
export class Trait extends MethodBase implements Sys.DeclaresDynamicType<Trait>{
    name:string
    usage:string
    $name=[MetaModel.key(),MetaModel.description("Name of the trait")]

    $=[MetaModel.inlinedTemplates(),MetaModel.allowQuestion()]
}
export class ResourceBase extends Common.RAMLLanguageElement{
    methods:Method[];


    //FIXME
    $methods=[MetaModel.description("Methods that are part of this resource type definition"),MetaModel.issue("definition system did not represents that ? is allowed after method names here")]

    is:TraitRef[]
    $is=[MetaModel.description("Instantiation of applyed traits"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

    type:ResourceTypeRef
    $type=[MetaModel.description("Instantiation of applyed resource type"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

    //TODO FIXME
    securedBy:SecuritySchemaRef[]
    $securedBy=[
        MetaModel.allowNull(),
        MetaModel.description(` securityScheme may also be applied to a resource by using the securedBy key, which is equivalent to applying the securityScheme to all methods that may be declared, explicitly or implicitly, by defining the resourceTypes or traits property for that resource.
To indicate that the method may be called without applying any securityScheme, the method may be annotated with the null securityScheme.`)]


    uriParameters:models.DataElement[]
    $uriParameters=[
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/71"),
        MetaModel.setsContextValue("location",models.ModelLocation.URI),
        MetaModel.setsContextValue("locationKind",models.LocationKind.APISTRUCTURE),
        MetaModel.setsContextValue("fieldOrParam",true),
        MetaModel.valueRestriction("_.find(relativeUri.templateArguments(),$value.name)","Uri parameter names should match to template names in relative uri"),
        MetaModel.description("Uri parameters of this resource")]

}
export class ResourceType extends ResourceBase implements Sys.DeclaresDynamicType<ResourceType>{
    name:string
    $name=[MetaModel.key(),MetaModel.description("Name of the resource type")]
    usage:string
    $=[MetaModel.inlinedTemplates(),MetaModel.allowQuestion()]
}


export class Method extends MethodBase{

    signature: Sys.SchemaString
    $signature=[MetaModel.canBeValue()]


    method:string;
    $method=[MetaModel.key(),
        MetaModel.extraMetaKey("methods"),
        MetaModel.oneOf(["get","put","post","delete","options","head","patch"]),MetaModel.description("Method that can be called"),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/95")]
}

export class Resource extends ResourceBase{
    signature: Sys.SchemaString
    $signature=[MetaModel.canBeValue()]

    relativeUri:Sys.RelativeUri
    $relativeUri=[MetaModel.key(),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/73"),
        MetaModel.grammarTokenKind("entity.name.tag.yaml"),
        MetaModel.startFrom("/"),MetaModel.description("Relative URL of this resource from the parent resource"),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/87")]
    resources:Resource[];
    $resources=[MetaModel.newInstanceName("New Resource"),MetaModel.description("Children resources")]
}
