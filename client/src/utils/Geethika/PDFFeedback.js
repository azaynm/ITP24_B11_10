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

    const generatePDFContent = () => (
        <Document>
            <Page size="A4">
                <View style={styles.container}>
                    <Text>Live Life Organics</Text>
                    <Text>Generated: {new Date().toLocaleString()}</Text>
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

    return (
        <div>
            
            <PDFDownloadLink document={generatePDFContent()} fileName="feedback.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
        </div>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: '20px',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    feedbackItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
    },
});

export default PDFFeedback;
