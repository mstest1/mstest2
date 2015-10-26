import  MetaModel = require("../metamodel")
import  Sys = require("./systemTypes")
import  RM=require("./methodsAndResources")
import  Decls=require("./declarations")
import  Params=require("./parameters")
import  Common=require("./common")
import  Bodies=require("./bodies")
import  models=require("./datamodel")

module RAMLSpec{


    export class GlobalSchema extends Common.RAMLSimpleElement implements Sys.Referencable<Sys.SchemaString>{
        key:string
        $key=[MetaModel.key(),MetaModel.description("Name of the global schema, used to refer on schema content")]
        value:Sys.SchemaString
        $value=[MetaModel.description("Content of the schema"),MetaModel.canBeValue(),MetaModel.value()]//TODO FIXME
        $=[MetaModel.actuallyExports("value"),MetaModel.description("Content of the schema")]
    }
    //export class GlobalExample extends Common.RAMLSimpleElement implements Sys.Referencable<Sys.SchemaString>{
    //    key:string
    //    $key=[MetaModel.key(),MetaModel.description("Name of the global schema, used to refer on schema content")]
    //    value:Sys.ExampleString
    //    $value=[MetaModel.description("Content of the schema")]//TODO FIXME
    //    $=[MetaModel.actuallyExports("value"),MetaModel.description("Content of the schema")]
    //}
    export class ImportDeclaration extends Common.RAMLSimpleElement{
        key:string
        $key=[MetaModel.key(),MetaModel.description("Name prefix (without dot) used to refer imported declarations")]

        value:Library
        $value=[MetaModel.description("Content of the declared namespace")];
    }

    class Library extends Common.RAMLLanguageElement{
        title: string;
        name: string;
        $name=[MetaModel.key()]
        schemas:GlobalSchema[]
        $schemas=[
            MetaModel.embeddedInMaps(),
            MetaModel.description("Alias for the types property, for compatibility with RAML 0.8. Deprecated - may be removed in a future RAML version."),
            MetaModel.valueDescription('')
        ]

        types:models.DataElement[]
        $types=[MetaModel.embeddedInMaps(),
            MetaModel.setsContextValue("locationKind",models.LocationKind.MODELS),
            MetaModel.description("Declarations of (data) types for use within this API"),
            MetaModel.markdownDescription(`Declarations of (data) types for use within this API. See [[types|Types]].`),
            MetaModel.valueDescription("An object whose properties map type names to type declarations; or an array of such objects")
        ]


        //examples:GlobalExample[]
        // $examples=[MetaModel.embeddedInMaps(),MetaModel.thisFeatureCovers("https://github.com/raml-org/raml-spec/issues/70")]

        traits:RM.Trait[]
        $traits=[
            MetaModel.embeddedInMaps(),MetaModel.description("Declarations of traits used in this API"),
            MetaModel.description("Declarations of traits for use within this API"),
            MetaModel.markdownDescription(`Declarations of traits for use within this API. See [[traits|Traits]].`),
            MetaModel.valueDescription("An object whose properties map trait names to trait declarations; or an array of such objects")
        ]

        resourceTypes:RM.ResourceType[]
        $resourceTypes=[
            MetaModel.embeddedInMaps(),MetaModel.description("Declaration of resource types used in this API"),
            MetaModel.description("Declarations of resource types for use within this API"),
            MetaModel.markdownDescription(`Declarations of resource types for use within this API. See [[resource-types|Resource Types]].`),
            MetaModel.valueDescription("An object whose properties map resource type names to resource type declarations; or an array of such objects")
        ]

        annotationTypes:Decls.AnnotationType[];
        $annotationTypes=[
            MetaModel.embeddedInMaps(),
            MetaModel.version(MetaModel.RAMLVersion.RAML10),
            MetaModel.description("Declarations of annotation types for use by annotations"),
            MetaModel.markdownDescription(`Declarations of annotation types for use by annotations. See [[annotation-types|Annotation Types]].`),
            MetaModel.valueDescription("An object whose properties map annotation type names to annotation type declarations; or an array of such objects")
//            ,MetaModel.issue("Clearly shows that better modularization needed"),MetaModel.setsContextValue("decls","true")
        ]

        securitySchemaTypes:RM.SecuritySchemaType[];
        $securitySchemaTypes=[MetaModel.embeddedInMaps(),MetaModel.description("Security schemas types declarations")]

        securitySchemes:RM.SecuritySchema[];
        $securitySchemes=[
            MetaModel.embeddedInMaps(),MetaModel.description("Security schemas declarations"),
            MetaModel.description("Declarations of security schemes for use within this API."),
            MetaModel.markdownDescription(`Declarations of security schemes for use within this API. See [[security-schemes|Security Schemes]].`),
            MetaModel.valueDescription("An object whose properties map security scheme names to security scheme declarations; or an array of such objects")
        ]

        uses:Library[];
        $uses=[
            MetaModel.embeddedInMaps(),
            MetaModel.description("Importing of modules with declarations"),
            MetaModel.setsContextValue("decls","true"),
            MetaModel.valueDescription("A set of libraries")
        ]
    }
    class Overlay extends Api{
        masterRef:string;
        $masterRef=[MetaModel.required()];

    }
    class Extension extends Api{
        masterRef:string;
        $masterRef=[MetaModel.required()];

    }

    class Api extends Library{

        title:string
        $title=[MetaModel.required(),MetaModel.description("Short plain-text label for the API")]

        version:string
        $version=[MetaModel.description(`The version of the API, e.g. "v1"`)]

        baseUri:Sys.FullUriTemplate
        $baseUri=[
            MetaModel.description(`A URI that’s to be used as the base of all the resources’ URIs. Often used as the base of the URL of each resource, containing the location of the API. Can be a template URI.`),
            MetaModel.valueDescription("URI template string")
            //,MetaModel.issue("https://github.com/raml-org/raml-spec/issues/72"),
            //MetaModel.issue("https://github.com/raml-org/raml-spec/issues/119"),MetaModel.issue("Overrriding on resource level looks pretty strange")
        ]
        baseUriParameters:models.DataElement[]


        $baseUriParameters=[
            MetaModel.setsContextValue("location",models.ModelLocation.BURI),
            MetaModel.setsContextValue("locationKind",models.LocationKind.APISTRUCTURE),
            MetaModel.description("Named parameters used in the baseUri (template)"),
            MetaModel.valueDescription("Object whose properties are base URI parameter names")
//            ,MetaModel.issue("Specification is not good enough"),MetaModel.issue("https://github.com/raml-org/raml-spec/issues/150")
        ]

        protocols:string[]
        $protocols=[
            MetaModel.oneOf(["HTTP","HTTPS"]),
//          MetaModel.issue("Not clear how it should work in combination with baseUri"),MetaModel.needsClarification("Actually it is a set"),
            MetaModel.description("The protocols supported by the API"),
            MetaModel.valueDescription("Array of strings, with each being “HTTP” or “HTTPS”, case-insensitive")
        ]

        mediaType:Bodies.MimeType
        $mediaType=[
            MetaModel.oftenKeys(["application/json","application/xml"
                ,"application/x-www-form-urlencoded",
                "multipart/formdata"]),
            MetaModel.description(`The default media type to use for request and response bodies (payloads), e.g. "application/json"`)
            ,MetaModel.inherited(),
            MetaModel.valueDescription("Media type string")
//            ,MetaModel.needsClarification("should be open enum")
        ]



        securedBy:RM.SecuritySchemaRef[]
        $securedBy=[
//            MetaModel.issue("Not stated clearly in spec"),
            MetaModel.description(`The security schemes that apply to every resource and method in the API`),
            MetaModel.valueDescription("Array of security scheme names")
        ]

        resources:RM.Resource[]
        $resources=[ MetaModel.documentationTableLabel("/<relativeUri>"),
            MetaModel.newInstanceName("New Resource"),
            MetaModel.description(`The resources of the API, identified as relative URIs that begin with a slash (/). Every property whose key begins with a slash (/), and is either at the root of the API definition or is the child property of a resource property, is a resource property, e.g.: /users, /{groupId}, etc`),
            MetaModel.valueDescription("Object whose properties describe the resource")
        ]

        documentation:DocumentationItem[]
        $documentation=[
            MetaModel.description(`Additional overall documentation for the API`),
            MetaModel.valueDescription("An array of document objects, each having exactly two string-valued properties: title and content.")
        ]

        $displayName = [ MetaModel.hide() ]

        $name = [ MetaModel.hide() ]

        $description=[MetaModel.description("A longer, human-friendly description of the API")]

        $annotations=[
            MetaModel.description("Declarations of annotations for use within this API. See Section X."),
            MetaModel.markdownDescription(`Declarations of annotations for use within this API. See [[annotations|Annotations]].`),
            MetaModel.valueDescription("An object whose properties map annotation type names to annotation type declarations; or an array of such objects")
        ]

        $securitySchemaTypes=[MetaModel.hide()]
    }


    //This is actually not tested//TODO
    class DocumentationItem extends Common.RAMLLanguageElement{
        title:string
        $title=[MetaModel.description("Title of documentation section")]
        content:Sys.MarkdownString
        $content=[
            MetaModel.description("Content of documentation section"),
            MetaModel.valueDescription("markdown string")
            //,MetaModel.issue("Needs better documentation, I would like to polish it in 1.0")
        ]
    }

    export class ScriptSpec extends Common.RAMLLanguageElement{
        language:string
        content:string;
    }
    export class ApiDescription extends Common.RAMLLanguageElement{
        apiFiles:Api[]
        script:ScriptSpec[];
        type:string
        $type=[MetaModel.oneOf(["endpoint","callback"]),MetaModel.descriminatingProperty()];
    }
    export class CallbackAPIDescription extends ApiDescription{
        type="callback"
        callbackFor:Api
    }
    export class RAMLProject extends Common.RAMLLanguageElement
    {
        relatedProjects:RAMLProject[]
        declaredApis:ApiDescription[]
        license:string
        overview:string
        url:string
    }
}

//To cover
//https://github.com/raml-org/raml-spec/issues/143
//https://github.com/raml-org/raml-spec/issues/135
//https://github.com/raml-org/raml-spec/issues/140
//Schema languages:
//https://github.com/raml-org/raml-spec/issues/117
//https://github.com/raml-org/raml-spec/issues/116
//Raml Pointers:
//https://github.com/raml-org/raml-spec/issues/138
//https://github.com/raml-org/raml-spec/issues/137
//https://github.com/raml-org/raml-spec/issues/130
//https://github.com/raml-org/raml-spec/issues/128
//https://github.com/raml-org/raml-spec/issues/109
//Important
//https://github.com/raml-org/raml-spec/issues/106
//https://github.com/raml-org/raml-spec/issues/108
//https://github.com/raml-org/raml-spec/issues/104
//https://github.com/raml-org/raml-spec/issues/103
//TODO

//https://github.com/raml-org/raml-spec/issues/121
//https://github.com/raml-org/raml-spec/issues/102
//https://github.com/raml-org/raml-spec/issues/32
