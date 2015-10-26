import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  Common=require("./common")

//////////////////////////////////////
// Parameters related declarations
var index:MetaModel.SpecPartMetaData={

    title:"Named Parameters"
}

export enum ParameterLocation{
    QUERY,HEADERS,URI,FORM,BURI

}

export class Parameter extends Common.RAMLLanguageElement{
    name:string
    $name=[MetaModel.key(),MetaModel.description("name of the parameter"),MetaModel.extraMetaKey("headers")]

    displayName: string
    type:string;
    $type=[MetaModel.defaultValue("string"),MetaModel.descriminatingProperty(),MetaModel.description("The type attribute specifies the primitive type of the parameter's resolved value. " +
    "API clients MUST return/throw an error if the parameter's resolved value does not match the specified type. If type is not specified, it defaults to string."),MetaModel.canBeDuplicator()]
    location:ParameterLocation
    $location=[MetaModel.system(),MetaModel.description("Location of the parameter (can not be edited by user)")]

    required: boolean
    $required=[MetaModel.description("Set to true if parameter is required")]

    default:string
    $default=[MetaModel.description("The default attribute specifies the default value to use for the property if the property is omitted or its value is not specified." +
    " This SHOULD NOT be interpreted as a requirement for the client to send the default attribute's value if there is no other value to send. " +
    "Instead, the default attribute's value is the value the server uses if the client does not send a value."),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/86")]
    example:string
    $example=[MetaModel.description("(Optional) The example attribute shows an example value for the property." +
    " This can be used, e.g., by documentation generators to generate sample values for the property."),MetaModel.needsClarification("It sounds consistent to allow multiple examples for parameters, " +
    "but it will make hard to describe difference between 0.8 and 1.0 in terms of def system")]
    repeat:boolean
    $repeat=[MetaModel.description("The repeat attribute specifies that the parameter can be repeated. " +
    "If the parameter can be used multiple times, the repeat parameter value MUST be set to 'true'. Otherwise, the default value is 'false' and the parameter may not be repeated."),MetaModel.issue("semantic of repeat " +
    "is not clearly specified and actually multiple possible reasonable options exists at the same time "),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/152")]

    $=[MetaModel.issue("Multiple  parameter types are not supported in this specification we should think about how to cover them properly using same key and redefining parameter looks pretty reasonable for 1.0")]
}

export class StrElement extends Parameter{
    pattern:string;
    $pattern=[
        MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/97"),
        MetaModel.description("(Optional, applicable only for parameters of type string) The pattern attribute is a regular expression that a parameter of type string MUST match. Regular expressions MUST follow the regular expression specification from ECMA 262/Perl 5. The pattern MAY be enclosed in double quotes for readability and clarity.")]
    enum:string[]
    $enum=[
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/82"),
        MetaModel.description("(Optional, applicable only for parameters of type string) The enum attribute provides an enumeration of the parameter's valid values. This MUST be an array. If the enum attribute is defined, API clients and servers MUST verify that a parameter's value matches a value in the enum array. If there is no matching value, the clients and servers MUST treat this as an error.")]
    minLength:number
    $minLength=[
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/93"),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/141"),MetaModel.description("(Optional, applicable only for parameters of type string) The minLength attribute specifies the parameter value's minimum number of characters.")]
    maxLength:number
    $maxLength=[MetaModel.description("(Optional, applicable only for parameters of type string) The maxLength attribute specifies the parameter value's maximum number of characters.")]
    type="string"
    $=[MetaModel.description("Value must be a string")]
}
export class BooleanElement extends Parameter{
    type="boolean"
    $=[MetaModel.description("Value must be a boolean")]

}
export class NumberElement extends Parameter{
    type="number"
    minimum:number
    $minimum=[MetaModel.description("(Optional, applicable only for parameters of type number or integer) The minimum attribute specifies the parameter's minimum value.")]
    maximum:number
    $maximum=[MetaModel.description("(Optional, applicable only for parameters of type number or integer) The maximum attribute specifies the parameter's maximum value.")]

    $=[MetaModel.description("Value MUST be a number. Indicate floating point numbers as defined by YAML.")]

}
export class IntegerElement extends NumberElement{
    type="integer"
    $=[MetaModel.description("Value MUST be a integer.")]

}
export class DateElement extends Parameter{

    type="date"
    $=[MetaModel.description("Value MUST be a string representation of a date as defined in RFC2616 Section 3.3 [RFC2616]. "),
    MetaModel.issue("https://github.com/raml-org/raml-spec/issues/105")]
}
export class FileElement extends Parameter{
    type="file"
    $=[MetaModel.requireValue("location",ParameterLocation.FORM),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/94"),
        MetaModel.description("(Applicable only to Form properties) Value is a file. Client generators SHOULD use this type to handle file uploads correctly.")]

}
export class HasNormalParameters extends Common.RAMLLanguageElement{
    queryParameters:Parameter[]
    displayName:string
    $displayName=[MetaModel.issue("I am not sure that it should be here but it is actually used")]//REVIEW
    $queryParameters=[
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/53"),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/78"),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/46"),
        MetaModel.setsContextValue("location",ParameterLocation.QUERY),MetaModel.newInstanceName("New query parameter"),MetaModel.description('An APIs resources MAY be filtered (to return a subset of results) or altered (such as transforming' +
    ' a response body from JSON to XML format) by the use of query strings. If the resource or its method supports a query string, the query string MUST be defined by the queryParameters property')]
    headers:Parameter[];
    $headers=[
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/59"),
        MetaModel.setsContextValue("location",ParameterLocation.HEADERS),
        MetaModel.description("Headers that allowed at this position"),
        MetaModel.newInstanceName("New Header"),MetaModel.issue("It is not clear if this also allowed for resources(check)"),MetaModel.issue("cover wildcards ({*})")]

}
