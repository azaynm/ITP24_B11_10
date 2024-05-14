import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMenu = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/menu/menu`);
            return response.data;
        } catch (error) {
            console.error('Error fetching menu items:', error);
            throw new Error('Failed to fetch menu items');
        }
    };


    useEffect(() => {
        setIsLoading(true);
        fetchMenu()
            .then(data => {
                setMenuItems(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    function formatDate(date) {
        const formattedDate = new Date(date).toLocaleString();
        return formattedDate;
    }

    function groupByCategory(items) {
        const groupedItems = items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {
                    count: 0,
                    items: []
                };
            }
            acc[item.category].count += 1;
            acc[item.category].items.push(item);
            return acc;
        }, {});
        return groupedItems;
    }





    const handleGeneratePDF = () => {
        const groupedItems = groupByCategory(menuItems);
        const pdfContent = (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text style={styles.header}>Live Life Organics</Text>
                        <Text style={styles.date}>Generated: {new Date().toLocaleString()}</Text>

                        <Text style={styles.title}>Summary:</Text>
                        <View style={styles.summaryContainer}>
                            {Object.entries(groupedItems).map(([category, data], index) => (
                                <View key={index} style={styles.categorySummary}>
                                    <View style={styles.summary}>
                                        <Text style={styles.categoryTitle}>{category}</Text>
                                        <Text style={styles.categoryTitle}>{data.count} items</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.title}>Menu Items:</Text>
                        {Object.entries(groupedItems).map(([category, data], index) => (
                            <View key={index}>
                                <Text style={styles.categoryTitle}>{category} ({data.count} items)</Text>

                                {data.items.map((item, subIndex) => (
                                    <View key={subIndex} style={styles.labelContainer}>
                                        {item.image && <Image style={styles.foodImage} src={item.image} />}
                                        <View style={styles.foodItem}>
                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>Name:</Text>
                                                <Text style={styles.value}>{item.name}</Text>
                                            </View>
                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>Description:</Text>
                                                <Text style={styles.value}>{item.description}</Text>
                                            </View>
                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>Price:</Text>
                                                <Text style={styles.value}>Rs.{item.sellingPrice}</Text>
                                            </View>
                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>Quantity:</Text>
                                                <Text style={styles.value}>{item.quantity}</Text>
                                            </View>
                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>Supplier:</Text>
                                                <Text style={styles.value}>{item.supplier}</Text>
                                            </View>
                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>Cost:</Text>
                                                <Text style={styles.value}>Rs.{item.cost}</Text>
                                            </View>
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
            <PDFDownloadLink document={handleGeneratePDF()} fileName="menu_items.pdf">
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
    container: {
        margin: '20px',
        padding: '20px',
        flexWrap: 'wrap',
    },
    summary: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    summaryContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    labelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginTop: '10px',
        marginBottom: '10px',
        textAlign: 'center',
    },
    foodItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        width: '300px',
        borderRadius: '5px',
    },
    foodName: {
        fontWeight: 'bold',
        marginBottom: '5px',
        fontSize: '18px',
    },
    foodImage: {
        marginBottom: '10px',
        width: '200px',
        height: '200px',
    },
    foodDescription: {
        fontStyle: 'italic',
        marginBottom: '5px',
    },
    foodPrice: {
        marginBottom: '5px',
        color: '#007bff',
    },
    foodQuantity: {
        marginBottom: '5px',
    },
    foodCategory: {
        marginBottom: '5px',
    },
    foodSupplier: {
        marginBottom: '5px',
    },
    foodCost: {
        marginBottom: '5px',
        color: 'red',
    },
});

export default PDFMenu;
