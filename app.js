import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

// Your eBird API key and region code for New York (as part of the Northeast US)
const API_KEY = '5ms7hdo849vo';
const REGION_CODE = 'US-NY'; // For New York as an example

export default class App extends Component {
    state = {
        sightings: [],
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.fetchRecentSightings();
    }

    fetchRecentSightings = () => {
        fetch(`https://api.ebird.org/v2/data/obs/${REGION_CODE}/recent`, {
            headers: {
                'X-eBirdApiToken': API_KEY,
            },
        })
            .then(response => {
                if (!response.ok) {  // Check if response status is not OK
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ sightings: data, loading: false });
            })
            .catch(error => {
                console.error("There was an error fetching data:", error);
                this.setState({ loading: false, error: error.toString() });
            });
    };

    render() {
        const { sightings, loading, error } = this.state;

        if (loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.container}>
                    <Text>Error fetching data: {error}</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={sightings}
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
