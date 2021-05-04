package main

import (
	"github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/session"
    "github.com/aws/aws-sdk-go/service/dynamodb"
    "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

    "fmt"
	"log"
	"strconv"
)

type Location struct {
	Lat float64
	Lng float64
	IsGarbage bool
	IsRecycling bool
	IsCompost bool
}

func AddLocation(svc *dynamodb.DynamoDB, err error, latCoord float64, lngCoord float64, garb bool, recycle bool, compost bool) {
	// Initialize a session that the SDK will use to load
	// credentials from the shared credentials file ~/.aws/credentials
	// and region from the shared configuration file ~/.aws/config.
	
	item := Location{
		Lat:   latCoord,
		Lng: lngCoord,
		IsGarbage:   garb,
		IsRecycling: recycle,
		IsCompost: compost,
	}
	av, err := dynamodbattribute.MarshalMap(item)
	if err != nil {
    	log.Fatalf("Got error marshalling new location item: %s", err)
	}
	tableName := "Locations"
	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}
	
	_, err = svc.PutItem(input)
	if err != nil {
		log.Fatalf("Got error calling PutItem: %s", err)
	}
	
	addedLat := strconv.FormatFloat(item.Lat, 'E', -1, 64)
	addedLng := strconv.FormatFloat(item.Lat, 'E', -1, 64)
	
	fmt.Println("Successfully added '" + addedLat + ", " + addedLng + " to table " + tableName)
}

func main() {
	sess, err := session.NewSession(&aws.Config{
        Region: aws.String("us-west-2")},
    )

	// Create DynamoDB client
	svc := dynamodb.New(sess)
	AddLocation(svc, err, 47.5638179, -122.1675207, false, true, true)

}
