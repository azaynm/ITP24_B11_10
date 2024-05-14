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

    const groupByAmount = (giftCards) => {
        const grouped = giftCards.reduce((acc, giftCard) => {
            if (!acc[giftCard.amount]) {
                acc[giftCard.amount] = [];
            }
            acc[giftCard.amount].push(giftCard);
            return acc;
        }, {});
    
        return Object.keys(grouped).map(amount => ({
            amount,
            giftCards: grouped[amount]
        }));
    };

    const generatePDFContent = () => {
        const groupedGiftCards = groupByAmount(giftCards);
        console.log("group",groupedGiftCards)
        groupedGiftCards.map((item, index)=>{console.log(index+1, item)})
        return (
            <Document>
            <Page size="A4">
                <View style={styles.container}>
                    <Text style={styles.header}>Live Life Organics</Text>
                    <Text style={styles.date}>Generated: {new Date().toLocaleString()}</Text>
                    <Text style={styles.title}>Purchased Gift Cards Details:</Text>
                    {groupedGiftCards.map((group, index) => (
                        <View key={index} style={styles.amountGroup}>
                            <Text style={styles.amountTitle}>Amount: Rs.{group.amount}</Text>
                            {group.giftCards.map((giftCard, subIndex) => (
                                <View key={subIndex} style={styles.giftCardItem}>
                                    <Text style={styles.label}>Customer Username:</Text>
                                    <Text style={styles.value}>{giftCard.customerUsername}</Text>
                                    <Text style={styles.label}>Code:</Text>
                                    <Text style={styles.value}>{giftCard.code}</Text>
                                    <Text style={styles.label}>Category:</Text>
                                    <Text style={styles.value}>{giftCard.category}</Text>
                                    <Text style={styles.label}>Amount:</Text>
                                    <Text style={styles.value}>Rs.{giftCard.amount}</Text>
                                    <Text style={styles.label}>Issue Date:</Text>
                                    <Text style={styles.value}>{new Date(giftCard.issueDate).toLocaleString()}</Text>
                                    <Text style={styles.label}>Expire Date:</Text>
                                    <Text style={styles.value}>{new Date(giftCard.expireDate).toLocaleString()}</Text>
                                    <Text style={styles.label}>Payment ID:</Text>
                                    <Text style={styles.value}>{giftCard.paymentId}</Text>
                                    <Text style={styles.label}>Is Used:</Text>
                                    <Text style={styles.value}>{giftCard.isUsed ? 'Yes' : 'No'}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
        );
    };

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
    amountGroup: {
        marginBottom: '20px',
    },
    amountTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        borderBottom: '1px solid #000',
        paddingBottom: '5px',
    },
    giftCardItem: {
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '5px',
        borderWidth: '1px',
        borderColor: '#ccc',
        borderStyle: 'solid',
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: '12px',
        fontWeight: 'bold',
    },
    value: {
        fontSize: '12px',
        marginBottom: '5px',
    },
});

export default PDFPurchasedGiftCard;
