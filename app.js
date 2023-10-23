import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

// Constants for eBird API
const API_KEY = '5ms7hdo849vo';
const REGION_CODE = 'US-NY';

export default class App extends Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            birdSightings: [],
            isLoading: true,
            errorMessage: null,
        };
    }

    componentDidMount() {
        this.getSightingsFromAPI();
    }

    getSightingsFromAPI() {
        const apiURL = `https://api.ebird.org/v2/data/obs/${REGION_CODE}/recent`;

        fetch(apiURL, {
            headers: {
                'X-eBirdApiToken': API_KEY,
            },
        })
            .then((response) => {
                // Convert the server's response into a JSON object
                return response.json();
            })
            .then((data) => {
                // Update the app's state with the new data
                this.setState({
                    birdSightings: data,
                    isLoading: false
                });
            })
            .catch((error) => {
                // If there was an error, update state to show error message
                this.setState({
                    isLoading: false,
                    errorMessage: 'Error fetching data'
                });
                console.error('There was an error fetching the data', error);
            });
    }

    render() {
        // Use destructuring for cleaner code
        const { birdSightings, isLoading, errorMessage } = this.state;

        // Show a loading spinner if data is still loading
        if (isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }

        // Show error message if there was an error fetching data
        if (errorMessage) {
            return (
                <View style={styles.container}>
                    <Text>{errorMessage}</Text>
                </View>
            );
        }

        // Render the list of bird sightings
        return (
            <View style={styles.container}>
                <FlatList
                    data={birdSightings}
                    keyExtractor={item => item.observationId}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text>{item.comName}</Text>
                            <Text>{item.locName}</Text>
                            <Text>{item.obsDt}</Text>
                        </View>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
