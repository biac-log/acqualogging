import { JsonObject, JsonProperty } from "json2typescript";
import { DateConverter } from "../converter/dateConverter";

@JsonObject("Logging")
export class Logging {
    @JsonProperty("id", Number)
    public id: Number = 0;
    @JsonProperty("date", DateConverter)
    public date: Date = new Date();
    @JsonProperty("user", String)
    public user: String = '';
    @JsonProperty("type", Number)
    public type: Number = 0;
    @JsonProperty("application", String)
    public application: String = '';
    @JsonProperty("applicationVersion", String)
    public applicationVersion: String = '';
    @JsonProperty("fonction", String)
    public fonction: String = '';
    @JsonProperty("message", String)
    public message: String = '';
    @JsonProperty("exceptionType", String)
    public exceptionType: String = '';
    @JsonProperty("descriptionLongue", String)
    public descriptionLongue: String = '';
    @JsonProperty("vu", Boolean)
    public vu: Boolean = false;
    @JsonProperty("dateVu", DateConverter)
    public dateVu: Date = new Date();
    @JsonProperty("corriger", Boolean)
    public corriger: Boolean = false;
    @JsonProperty("dateCorriger", DateConverter)
    public dateCorriger: Date = new Date();
    @JsonProperty("commentaire", String)
    public commentaire: String = '';
}

