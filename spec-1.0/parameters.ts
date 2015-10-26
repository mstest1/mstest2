import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  Common=require("./common")
import  datamodel=require("./datamodel")
//////////////////////////////////////
// Parameters related declarations
var index:MetaModel.SpecPartMetaData={

    title:"Named Parameters"
}


export class FileParameter extends datamodel.DataElement{
    type="file"
    fileTypes:Sys.ContentType[]
    $fileTypes=[MetaModel.description("It should also include a new property: fileTypes, which should be a list of valid content-type strings for the file. The file type */* should be a valid value.")]

    minLength:number
    $minLength=[MetaModel.description("The minLength attribute specifies the parameter value's minimum number of bytes.")]
    maxLength:number
    $maxLength=[MetaModel.description("The maxLength attribute specifies the parameter value's maximum number of bytes.")]


    $=[
        MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/94"),
        MetaModel.description("(Applicable only to Form properties) Value is a file. Client generators SHOULD use this type to handle file uploads correctly.")]

}
export class HasNormalParameters extends Common.RAMLLanguageElement{
    queryParameters:datamodel.DataElement[]
    $queryParameters=[
        MetaModel.setsContextValue("fieldOrParam",true),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/78"),
        MetaModel.setsContextValue("location",datamodel.ModelLocation.QUERY),
        MetaModel.setsContextValue("locationKind",datamodel.LocationKind.APISTRUCTURE),
        MetaModel.newInstanceName("New query parameter"),MetaModel.description('An APIs resources MAY be filtered (to return a subset of results) or altered (such as transforming' +
    ' a response body from JSON to XML format) by the use of query strings. If the resource or its method supports a query string, the query string MUST be defined by the queryParameters property')]
    headers:datamodel.DataElement[];
    $headers=[
        MetaModel.setsContextValue("fieldOrParam",true),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/59"),
        MetaModel.setsContextValue("location",datamodel.ModelLocation.HEADERS),
        MetaModel.setsContextValue("locationKind",datamodel.LocationKind.APISTRUCTURE),
        MetaModel.description("Headers that allowed at this position"),
        MetaModel.newInstanceName("New Header"),MetaModel.issue("It is not clear if this also allowed for resources(check)"),MetaModel.issue("cover wildcards ({*})")]

}
