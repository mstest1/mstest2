import  MetaModel = require("../metamodel")

export class ValueType {
    /**
     * parses inner structure of value type if value type has invalid value you should throw error
     * with descriptive message
     */
    parse():any{}


}
export class StringType extends ValueType { $=[MetaModel.nameAtRuntime("string")]; value():string{return null} }
export class NumberType extends ValueType { $=[MetaModel.nameAtRuntime("number"),MetaModel.alias("integer"),MetaModel.alias("number")]}
export class BooleanType extends ValueType{ $=[MetaModel.nameAtRuntime("boolean"),MetaModel.alias("boolean")]}//FIXME
/**
 * Tag interface, types implementing this interface
 * are counted as global declarations, and their
 * instances may be referred
 */
export interface Referencable<T>{}
export class Reference<T> extends ValueType{}//this is not true ...FIXME

export interface DeclaresDynamicType<T> extends Referencable<T>{}//For now your still required to put declaresSubtype or inlinedTemplates annotation on the classs

export class UriTemplate extends StringType {

    $=[MetaModel.description("This type currently serves both for absolute and relative urls"),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/115")]


}
export class StatusCode extends StringType{

}

export class ramlexpression extends ValueType{

}
export class RelativeUri extends UriTemplate{
    $=[MetaModel.description("This  type describes relative uri templates")]

    //parse():string[]{
    //    var value=this.value();
    //    var result=[]
    //    var temp="";
    //    var inPar=false;
    //    var count=0;
    //    for (var a=0;a<value.length;a++){
    //        var c=value[a];
    //        if (c=='{'){
    //            count++;
    //            inPar=true;
    //            continue;
    //        }
    //        if (c=='}'){
    //            count--;
    //            inPar=false;
    //            result.push(temp);
    //            temp="";
    //            continue;
    //        }
    //        if (inPar){
    //            temp+=c;
    //        }
    //    }
    //    if (count>0){
    //        throw new Error("Unmatched '{'")
    //    }
    //    if (count<0){
    //        throw new Error("Unmatched '}'")
    //    }
    //    return result;
    //}
}
export class FullUriTemplate extends UriTemplate{
    $=[MetaModel.description("This  type describes absolute uri templates")]
    //parse():string[]{
    //    var value=this.value();
    //    var result=[]
    //    var temp="";
    //    var inPar=false;
    //    var count=0;
    //    for (var a=0;a<value.length;a++){
    //        var c=value[a];
    //        if (c=='{'){
    //            count++;
    //            inPar=true;
    //            continue;
    //        }
    //        if (c=='}'){
    //            count--;
    //            inPar=false;
    //            result.push(temp);
    //            temp="";
    //            continue;
    //        }
    //        if (inPar){
    //            temp+=c;
    //        }
    //    }
    //    if (count>0){
    //        throw new Error("Unmatched '{'")
    //    }
    //    if (count<0){
    //        throw new Error("Unmatched '}'")
    //    }
    //    return result;
    //}

    validate(){
        var str=this.value();
        //write something to validate Url here
    }
}
export class FixedUri extends StringType{
    $=[MetaModel.description("This  type describes fixed uris")]
}
export class ContentType extends StringType{

}
export class ValidityExpression extends StringType{
    //TODO SPECIFY WHAT CAN NOT BE HERE
}


export class MarkdownString extends  StringType{
    $=[MetaModel.innerType("markdown"),
        MetaModel.issue("https://github.com/raml-org/raml-spec/issues/80"),
        MetaModel.description("Mardown string is a string which can contain markdown as an extension this markdown should support links with RAML Pointers since 1.0")
    ]
}
export class DateFormatSpec extends StringType{

}
export class FunctionalInterface extends StringType{

}

export class SchemaString extends StringType{

    $=[MetaModel.description("Schema at this moment only two subtypes are supported (json schema and xsd)"),MetaModel.alias("schema")]

    validate(){
        var str=this.value();
        //write something to validate schema here here
        //in fact it should check that content is valid json or xsd schema
    }
}
export class ExampleString extends StringType{
    $=[MetaModel.description("Examples at this moment only two subtypes are supported (json  and xml)")]

    validate(){
        var str=this.value();
        //write something to validate schema here here
        //in fact it should check that content is valid json or xsd schema
    }
}

export class JSonSchemaString extends SchemaString{
    $=[MetaModel.innerType("json"),MetaModel.description("JSON schema")]
}
export class XMLSchemaString extends SchemaString{
    $=[MetaModel.innerType("xsd"),MetaModel.description("XSD schema")]
}

export class ScriptingHook<T> extends StringType{
    $=[MetaModel.description("script to inject to tooling environment")]
}

export class RAMLPointer extends StringType{

}
export class RAMLSelector extends StringType{

}
