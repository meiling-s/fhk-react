export interface MapData {
    place_id:     number;
    licence:      string;
    osm_type:     string;
    osm_id:       number;
    lat:          string;
    lon:          string;
    class:        string;
    type:         string;
    place_rank:   number;
    importance:   number;
    addresstype:  string;
    name:         string;
    display_name: string;
    address:      Address;
    boundingbox:  string[];
}

export interface Address {
    residential:      string;
    suburb:           string;
    city:             string;
    municipality:     string;
    state:            string;
    "ISO3166-2-lvl3": string;
    country:          string;
    country_code:     string;
}

export type Position = {
    lat: number;
    lon: number;
  };

