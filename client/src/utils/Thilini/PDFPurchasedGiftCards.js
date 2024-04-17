import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const API_BASE = "http://localhost:8080";

const PDFPurchasedGiftCard = () => {
    const [giftCards, setGiftCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGiftCards = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/api/gift-card/gift-cards/user/${localStorage.getItem("username")}`);
            setGiftCards(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGiftCards();
    }, []);

    const generatePDFContent = () => (
        <Document>
            <Page size="A4">
                <View style={styles.container}>
                    <Text>Live Life Organics</Text>
                    <Text>Generated: {new Date().toLocaleString()}</Text>
                    <Text style={styles.title}>Purchased Gift Cards Details:</Text>
                    {giftCards.map((giftCard, index) => (
                        <View key={index} style={styles.giftCardItem}>
                            <Text>Customer Username: {giftCard.customerUsername}</Text>
                            <Text>Code: {giftCard.code}</Text>
                            <Text>Category: {giftCard.category}</Text>
                            <Text>Amount: {giftCard.amount}</Text>
                            <Text>Issue Date: {new Date(giftCard.issueDate).toLocaleString()}</Text>
                            <Text>Expire Date: {new Date(giftCard.expireDate).toLocaleString()}</Text>
                            <Text>Payment ID: {giftCard.paymentId}</Text>
                            <Text>Is Used: {giftCard.isUsed ? 'Yes' : 'No'}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <PDFDownloadLink document={generatePDFContent()} fileName="purchased_gift_cards.pdf">
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                </div>
            )}
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
    giftCardItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
    },
});

export default PDFPurchasedGiftCard;
