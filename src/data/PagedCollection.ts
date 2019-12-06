import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("PagedCollection")
export class PagedCollection<T> {
    @JsonProperty("items", Array)
    public items: Array<T> = [];
    @JsonProperty("nextPage", String)
    public nextPage: String = '';
    @JsonProperty("previousPage", String)
    public previousPage: String = '';
    @JsonProperty("totalCount", Number)
    public totalCount: Number = 0;
}

// public IEnumerable<T> Items { get; set; }
// public Uri NextPage { get; set; }
// public Uri PreviousPage { get; set; }