package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Geometry struct {
	FeatureType string     `json:"type"`
	Coordinates [2]float32 `json:"coordinates"`
}

type Properties struct {
	IsTrash     bool `json:"isTrash"`
	IsRecycling bool `json:"isRecycling"`
	IsCompost   bool `json:"isCompost"`
}

type TrashCan struct {
	FeatureType string     `json:"type"`
	Geom        Geometry   `json:"geometry"`
	Prop        Properties `json:"properties"`
}

var Articles []TrashCan

func main() {
	Articles = []TrashCan{
		{
			FeatureType: "Feature",
			Geom:        Geometry{FeatureType: "Point", Coordinates: [2]float32{1.3, 2.4}},
			Prop:        Properties{IsTrash: true, IsRecycling: true, IsCompost: true},
		},
	}
	handleRequests()
}
func returnAllArticles(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint hit: returnAllArticles")
	json.NewEncoder(w).Encode(Articles)
}
func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}
func handleRequests() {
	http.HandleFunc("/", homePage)
	http.HandleFunc("/articles", returnAllArticles)
	log.Fatal(http.ListenAndServe(":10000", nil))
}
