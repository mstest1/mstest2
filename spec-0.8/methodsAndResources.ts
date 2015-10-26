import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  Params=require("./parameters")
import  Bodies=require("./bodies")
import  Common=require("./common")
///////////////////////////////////////////////////////////
//Resources  methods and Api, demonstrate setting context values a bit

export class ResourceTypeRef extends Sys.Reference<ResourceType>{

}

export class TraitRef extends Sys.Reference<Trait>{

}
export class SecuritySchemaPart extends Common.RAMLSimpleElement{

    $=[MetaModel.allowAny(),MetaModel.issue("Specification is actually very vague here")]
}
export class SecuritySchemaSettings extends Common.RAMLSimpleElement{

    //TODO FILL OATH1, OATH2 requirements
    $=[MetaModel.allowAny(),MetaModel.issue("Specification is actually very vague here")]
}
export class OAuth1SecuritySchemeSettings extends  SecuritySchemaSettings{
    $=[MetaModel.functionalDescriminator("$parent.type=='OAuth 1.0'"),MetaModel.allowAny(),MetaModel.issue("Specification is actually very vague here")]

    requestTokenUri:Sys.FixedUri
    $requestTokenUri=[MetaModel.required(),MetaModel.description("The URI of the Temporary Credential Request endpoint as defined in RFC5849 Section 2.1")]

    authorizationUri:Sys.FixedUri
    $authorizationUri=[MetaModel.required(),MetaModel.description("The URI of the Resource Owner Authorization endpoint as defined in RFC5849 Section 2.2")]

    tokenCredentialsUri:Sys.FixedUri
    $tokenCredentialsUri=[MetaModel.required(),MetaModel.description("The URI of the Token Request endpoint as defined in RFC5849 Section 2.3")]

}
export class OAuth2SecuritySchemeSettings extends  SecuritySchemaSettings{
    $=[MetaModel.functionalDescriminator("$parent.type=='OAuth 2.0'"),MetaModel.allowAny(),MetaModel.issue("Specification is actually very vague here")]

    accessTokenUri:Sys.FixedUri
    $accessTokenUri=[MetaModel.required(),MetaModel.description("The URI of the Token Endpoint as defined in RFC6749 [RFC6748] Section 3.2")]

    authorizationUri:Sys.FixedUri
    $authorizationUri=[MetaModel.required(),MetaModel.description("The URI of the Authorization Endpoint as defined in RFC6749 [RFC6748] Section 3.1")]

    authorizationGrants:string[]
    $authorizationGrants=[MetaModel.required(),MetaModel.description("A list of the Authorization grants supported by the API As defined in RFC6749 [RFC6749] Sections 4.1, 4.2, 4.3 and 4.4, can be any of: code, token, owner or credentials.")]

    scopes:string[]
    $scopes=[MetaModel.description("A list of scopes supported by the API as defined in RFC6749 [RFC6749] Section 3.3")]
}

export class SecuritySchemaRef extends Sys.Reference<SecuritySchema>{

}


export class SecuritySchema extends Common.RAMLLanguageElement implements Sys.Referencable<SecuritySchema> {
    name:string
    $name=[MetaModel.key()]

    type:string
    $type=[MetaModel.oneOf(["OAuth 1.0","OAuth 2.0","Basic Authentication","Digest Authentication","x-{other}"]),MetaModel.description(
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
//export class HasNormalParameters extends Common.RAMLLanguageElement{
//    queryParameters:Params.Parameter[]
//    displayName:string
//    $displayName=[MetaModel.issue("I am not sure that it should be here but it is actually used")]//REVIEW
//    $queryParameters=[
//        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/53"),
//        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/78"),
//        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/46"),
//        MetaModel.setsContextValue("location",ParameterLocation.QUERY),MetaModel.newInstanceName("New query parameter"),MetaModel.description('An APIs resources MAY be filtered (to return a subset of results) or altered (such as transforming' +
//        ' a response body from JSON to XML format) by the use of query strings. If the resource or its method supports a query string, the query string MUST be defined by the queryParameters property')]
//    headers:Parameter[];
//    $headers=[
//        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/59"),
//        MetaModel.setsContextValue("location",ParameterLocation.HEADERS),
//        MetaModel.description("Headers that allowed at this position"),
//        MetaModel.newInstanceName("New Header"),MetaModel.issue("It is not clear if this also allowed for resources(check)"),MetaModel.issue("cover wildcards ({*})")]
//
//}
export class MethodBase extends Params.HasNormalParameters{

    responses:Bodies.Response[]

    $responses=[MetaModel.newInstanceName("New Response"),MetaModel.description(`Resource methods MAY have one or more responses. Responses MAY be described using the description property, and MAY include example attributes or schema properties.
`)]

    body:Bodies.BodyLike[]
    $body=[MetaModel.newInstanceName("New Body"),MetaModel.description(`Some method verbs expect the resource to be sent as a request body. For example, to create a resource, the request must include the details of the resource to create.
Resources CAN have alternate representations. For example, an API might support both JSON and XML representations.
A method's body is defined in the body property as a hashmap, in which the key MUST be a valid media type.`),MetaModel.needsClarification("Ensure that forms spec is consistent with it")]



    is:TraitRef[]
    securedBy:SecuritySchemaRef[]
    $securedBy=[

        MetaModel.allowNull(),
        MetaModel.description(`A list of the security schemas to apply, these must be defined in the securitySchemes declaration.
To indicate that the method may be called without applying any securityScheme, the method may be annotated with the null securityScheme.
Security schemas may also be applied to a resource with securedBy, which is equivalent to applying the security schemas to all methods that may be declared, explicitly or implicitly, by defining the resourceTypes or traits property for that resource.`)]
    $is=[MetaModel.description("Instantiation of applyed traits"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

}
export class Trait extends MethodBase implements Sys.DeclaresDynamicType<Trait>{
    name:string
    usage:string
    $name=[MetaModel.key(),MetaModel.description("Name of the trait")]

    $=[MetaModel.inlinedTemplates(),MetaModel.allowQuestion()]
}

export class ResourceType extends Common.RAMLLanguageElement implements Sys.DeclaresDynamicType<ResourceType>{
    name:string
    usage:string


    $name=[MetaModel.key(),MetaModel.description("Name of the resource type")]
    methods:Method[];
    //FIXME
    $methods=[MetaModel.description("Methods that are part of this resource type definition"),MetaModel.issue("definition system did not represents that ? is allowed after method names here")]

    is:TraitRef[]
    $is=[MetaModel.description("Instantiation of applyed traits"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

    type:ResourceTypeRef
    $type=[MetaModel.description("Instantiation of applyed resource type"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]
    //TODO FIXME

    $=[MetaModel.inlinedTemplates(),MetaModel.allowQuestion()]

    securedBy:SecuritySchemaRef[]
    $securedBy=[
        MetaModel.allowNull(),
        MetaModel.description(` securityScheme may also be applied to a resource by using the securedBy key, which is equivalent to applying the securityScheme to all methods that may be declared, explicitly or implicitly, by defining the resourceTypes or traits property for that resource.
To indicate that the method may be called without applying any securityScheme, the method may be annotated with the null securityScheme.`)]


    uriParameters:Params.Parameter[]
    $uriParameters=[
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/71"),
        MetaModel.setsContextValue("location",Params.ParameterLocation.URI),
        MetaModel.description("Uri parameters of this resource")]
        //TODO MERGE REUSED STUFF WITH RESOURCE
}


export class Method extends MethodBase{
    method:string;
    $method=[MetaModel.key(),
        MetaModel.extraMetaKey("methods"),
        MetaModel.oneOf(["get","put","post","delete","patch","options","head"]),MetaModel.description("Method that can be called"),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/95")]
    //$baseUriParameters=[MetaModel.setsContextValue("location",Params.ParameterLocation.BURI),MetaModel.description("A resource or a method can override a base URI template's values. This is useful to restrict or change the default or parameter selection in the base URI. The baseUriParameters property MAY be used to override any or all parameters defined at the root level baseUriParameters property, as well as base URI parameters not specified at the root level."
    //),MetaModel.issue("This feature is not consistent (causes not solvable overloading)"),MetaModel.needsClarification("Is it also related to resource types and traits")]

    protocols:string[]
    $protocols=[MetaModel.oneOf(["HTTP","HTTPS"]),
        MetaModel.issue("Not clear how it should work in combination with baseUri also is it also related to resources and types/traits"),MetaModel.needsClarification("Actually it is a set"),
        MetaModel.description("A method can override an API's protocols value for that single method by setting a different value for the fields.")]

    $=[MetaModel.description("Method object allows description of http methods")]

    securedBy:SecuritySchemaRef[]
    $securedBy=[
        MetaModel.allowNull(),
        MetaModel.description(` securityScheme may also be applied to a resource by using the securedBy key, which is equivalent to applying the securityScheme to all methods that may be declared, explicitly or implicitly, by defining the resourceTypes or traits property for that resource.
To indicate that the method may be called without applying any securityScheme, the method may be annotated with the null securityScheme.`)]

}

export class Resource extends Common.RAMLLanguageElement{
    relativeUri:Sys.RelativeUri
    $relativeUri=[MetaModel.key(),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/73"),
        MetaModel.grammarTokenKind("entity.name.tag.yaml"),
        MetaModel.startFrom("/"),MetaModel.description("Relative URL of this resource from the parent resource"),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/87")]
    type:ResourceTypeRef
    $type=[MetaModel.description("Instantiation of applyed resource type"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

    is:TraitRef[]
    $is=[MetaModel.description("Instantiation of applyed traits"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/98")]

    securedBy:SecuritySchemaRef[]
    $securedBy=[
        MetaModel.allowNull(),
        MetaModel.description(` securityScheme may also be applied to a resource by using the securedBy key, which is equivalent to applying the securityScheme to all methods that may be declared, explicitly or implicitly, by defining the resourceTypes or traits property for that resource.
To indicate that the method may be called without applying any securityScheme, the method may be annotated with the null securityScheme.`)]

    uriParameters:Params.Parameter[]
    $uriParameters=[
        MetaModel.setsContextValue("fieldOrParam",true),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/71"),
        MetaModel.setsContextValue("location",Params.ParameterLocation.URI),
        MetaModel.valueRestriction("_.find(relativeUri.parse(),$value.name)","Uri parameter names should match to template names in relative uri"),
        MetaModel.description("Uri parameters of this resource")]

    methods:Method[];
    $methods=[MetaModel.newInstanceName("New Method"),MetaModel.description("Methods that can be called on this resource")]
    resources:Resource[];
    $resources=[MetaModel.newInstanceName("New Resource"),MetaModel.description("Children resources")]


    displayName: string
    baseUriParameters:Params.Parameter[]

    $baseUriParameters=[MetaModel.setsContextValue("fieldOrParam",true),MetaModel.setsContextValue("location",Params.ParameterLocation.BURI),MetaModel.description("A resource or a method can override a base URI template's values. This is useful to restrict or change the default or parameter selection in the base URI. The baseUriParameters property MAY be used to override any or all parameters defined at the root level baseUriParameters property, as well as base URI parameters not specified at the root level."
    ),MetaModel.issue("This feature is not consistent (causes not solvable overloading)")]
}
