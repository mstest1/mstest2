import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  datamodel=require("./datamodel")
import  common=require("./common")
/////////////////////////////////
// GENERIC GLOBAL DECLARATIONS

export class AnnotationType extends common.RAMLLanguageElement implements Sys.DeclaresDynamicType<AnnotationType>{
    name:string
    $name=[MetaModel.key(),MetaModel.description("Name of this annotation type")]

    usage: string

    parameters:datamodel.DataElement[];
    $parameters=[MetaModel.setsContextValue("fieldOrParam",true),MetaModel.declaringFields(),
        MetaModel.setsContextValue("locationKind",datamodel.LocationKind.APISTRUCTURE),
        MetaModel.setsContextValue("location",datamodel.ModelLocation.ANNOTATION),
        MetaModel.description("Declarations of parameters allowed in this annotation type")];

    allowMultiple:boolean;
    $allowMultiple=[MetaModel.declaringFields(),MetaModel.description("If set to true parameter can accept multiple values")];

    allowedTargets:AnnotationTarget[]
    $allowedTargets=[MetaModel.extraMetaKey("annotationTargets"),MetaModel.description("Places where this annotation might be placed")]

    //On the design level every annotation usage is instantiation of subclass of particular AnnotationType
    //on the runtime level it is just Annotation (which is abstract on  the design level)
    //this inheritance strangeness happens because we do not want bring AnnotationType fields to Annotation
    //TODO think about it
    $=[MetaModel.declaresSubTypeOf("Annotation"),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/147")]
}
export class AnnotationRef extends Sys.Reference<AnnotationType>{

    $=[MetaModel.description("Instantiation of annotations. It allows you to attach some meta information to your API")]
}
export class AnnotationTarget extends Sys.ValueType{

}



//This type did not exists on RAML design level (basically it's design level counter part is AnnotationRef)
export class Annotation<T>{
    name:string

    $name=[MetaModel.key()]
}
