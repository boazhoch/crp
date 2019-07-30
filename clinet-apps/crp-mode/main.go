package main

import (
	"net/http"

	"github.com/lpar/gzipped"
)

func main() {
	http.ListenAndServe(":4444", gzipped.FileServer(http.Dir("static")))
}
