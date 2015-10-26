import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  Decls=require("./declarations")

/**
 * Created by kor on 07/07/15.
 */
export class RAMLLanguageElement {

    displayName:string
    $displayName=[
        MetaModel.description("The displayName attribute specifies the $self's display name. It is a friendly name used only for display or documentation purposes. " +
    "If displayName is not specified, it defaults to the element's key (the name of the property itself).")
        //,MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/136")
    ]

    description:Sys.MarkdownString
    $description=[
        MetaModel.description("The description attribute describes the intended use or meaning of the $self. This value MAY be formatted using Markdown [MARKDOWN]"),
        MetaModel.valueDescription("Markdown string")
    ]

    annotations:Decls.AnnotationRef[]
    $annotations=[MetaModel.version(MetaModel.RAMLVersion.RAML10),
        MetaModel.setsContextValue("locationKind","datamodel.LocationKind.APISTRUCTURE"),
        MetaModel.setsContextValue("location","datamodel.ModelLocation.ANNOTATION"),
//        MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/110"),
//        MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/74"),
        MetaModel.description("Most of RAML model elements may have attached annotations decribing additional meta data about this element")]
    //TODO FIX DESCRIPTION
}
export class RAMLSimpleElement{

}