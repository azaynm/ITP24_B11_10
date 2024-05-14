import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/feedback/feedbacks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            throw new Error('Failed to fetch feedbacks');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchFeedbacks()
            .then(data => {
                setFeedbacks(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    const groupByDeliveryStaff = (items) => {
        const grouped = feedbacks.reduce((acc, item) => {
            if (!acc[item.deliveryStaff]) {
                acc[item.deliveryStaff] = [];
            }
            acc[item.deliveryStaff].push(item);
            return acc;
        }, {});

        return Object.keys(grouped).map(deliveryStaff => ({
            deliveryStaff,
            items: grouped[deliveryStaff]
        }));
    };

    const groupByCheff = (items) => {
        const grouped = feedbacks.reduce((acc, item) => {
            if (!acc[item.cheff]) {
                acc[item.cheff] = [];
            }
            acc[item.cheff].push(item);
            return acc;
        }, {});

        return Object.keys(grouped).map(cheff => ({
            cheff,
            items: grouped[cheff]
        }));
    };

    const calculateAverageRating = (items, ratingType) => {
        if (items.length === 0) return 0;
        const total = items.reduce((sum, item) => sum + item[ratingType], 0);
        return (total / items.length).toFixed(2);
    };

    const Table = ({ title, headers, data }) => (
        <View style={styles.table}>
            <Text style={styles.tableTitle}>{title}</Text>
            <View style={styles.tableRow}>
                {headers.map((header, index) => (
                    <Text key={index} style={[styles.tableCell, styles.tableHeader]}>{header}</Text>
                ))}
            </View>
            {data.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                    {row.map((cell, cellIndex) => (
                        <Text key={cellIndex} style={styles.tableCell}>{cell}</Text>
                    ))}
                </View>
            ))}
        </View>
    );

    const generatePDFContent = () => {
        const groupedDeliveryStaff = groupByDeliveryStaff(feedbacks);
        const groupedCheff = groupByCheff(feedbacks);

        const deliveryStaffTableData = groupedDeliveryStaff.map(group => [
            group.deliveryStaff,
            calculateAverageRating(group.items, 'deliveryRating')
        ]);

        const cheffTableData = groupedCheff.map(group => [
            group.cheff,
            calculateAverageRating(group.items, 'foodRating')
        ]);

        return (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text style={styles.header}>Live Life Organics</Text>
                        <Text style={styles.date}>Generated: {new Date().toLocaleString()}</Text>

                        <Table
                            title="Delivery Staff [Delivery Ratings]"
                            headers={["Delivery Staff", "Average Rating"]}
                            data={deliveryStaffTableData}
                        />

                        <Table
                            title="Chefs [Food Ratings]"
                            headers={["Chef", "Average Rating"]}
                            data={cheffTableData}
                        />

                        <Text style={styles.title}>Feedback Details:</Text>
                        {feedbacks.map((feedback, index) => (
                            <View key={index} style={styles.feedbackItem}>
                                <Text>Delivery Rating: {feedback.deliveryRating}</Text>
                                <Text>Food Rating: {feedback.foodRating}</Text>
                                <Text>Order ID: {feedback.orderId}</Text>
                                <Text>Customer: {feedback.customer}</Text>
                                <Text>Note: {feedback.note}</Text>
                                <Text>Created At: {new Date(feedback.createdAt).toLocaleString()}</Text>
                                <Text>Delivery Staff: {feedback.deliveryStaff}</Text>
                                <Text>Chef: {feedback.cheff}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <div>
            <PDFDownloadLink document={generatePDFContent()} fileName="feedback.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
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
    },
    table: {
        marginBottom: '20px',
    },
    tableTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #ccc',
    },
    tableCell: {
        flex: 1,
        padding: '5px',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#eee',
    },
    feedbackItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
    },
});

export default PDFFeedback;
