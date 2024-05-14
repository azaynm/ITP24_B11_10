import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFInventory = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/inventory/inventory`);
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            throw new Error('Failed to fetch inventory items');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchInventory()
            .then(data => {
                setInventoryItems(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    const groupByCategory = (items) => {
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
    
        return Object.keys(grouped).map(category => ({
            category,
            items: grouped[category]
        }));
    };

    function getDate(date) {
        const today = new Date(date);
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const day = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();

        // Convert hours to AM/PM format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        // Add leading zero if minutes or seconds are less than 10
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `${month}/${day}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    }

    const handleGeneratePDF = () => {
        const groupedCategories = groupByCategory(inventoryItems);
        const pdfContent = (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text style={styles.header}>Live Life Organics</Text>
                        <Text style={styles.date}>Generated: {new Date().toLocaleString()}</Text>

                        <Text style={styles.title}>Inventory Stock</Text>
                        {groupedCategories.map((group, index) => (
                            <View key={index} style={styles.groupItem}>
                                <Text style={styles.label}>{group.category}:</Text>
                                <Text style={styles.value}>{group.items.length} items</Text>
                            </View>
                        ))}

                        <Text style={styles.title}>Inventory Items:</Text>
                        {groupedCategories.map((group, index) => (
                            <View key={index}>
                                <Text style={styles.categoryTitle}>{group.category}</Text>
                                {group.items.map((item, subIndex) => (
                                    <View key={subIndex} style={styles.foodItem}>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Name:</Text>
                                            <Text style={styles.value}>{item.name}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Quantity:</Text>
                                            <Text style={styles.value}>{item.quantity}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Price:</Text>
                                            <Text style={styles.value}>Rs.{item.price}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Supplier:</Text>
                                            <Text style={styles.value}>{item.supplier}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Expiration Date:</Text>
                                            <Text style={styles.value}>{getDate(item.expirationDate)}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Category:</Text>
                                            <Text style={styles.value}>{item.category}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Date:</Text>
                                            <Text style={styles.value}>{getDate(item.date)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
        return pdfContent;
    };

    return (
        <div>
            <PDFDownloadLink document={handleGeneratePDF()} fileName="inventory_items.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download PDF'
                }
            </PDFDownloadLink>
        </div>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        fontSize: '12px',
        textAlign: 'center',
        marginBottom: '10px',
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    container: {
        margin: '20px',
        padding: '20px',
        flexWrap: 'wrap',
    },
    labelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    categoryTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: '20px',
        marginBottom: '10px',
    },
    foodItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        width: '500px',
        borderRadius: '5px',
    },
    label: {
        fontWeight: 'bold',
        marginRight: '5px',
    },
    value: {
        flex: 1,
    },
    groupItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '5px',
    },
});

export default PDFInventory;
