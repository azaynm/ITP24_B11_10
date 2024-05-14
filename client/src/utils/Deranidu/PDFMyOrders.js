import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const API_BASE = "http://localhost:8080";

const PDFMyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/order/orders/${localStorage.getItem('username')}`);
            setOrders(response.data);
            console.log(response.data)
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const groupOrdersByAmount = (orders) => {
        const groups = {
            '100-500': [],
            '500-1000': [],
            '1000-1500': [],
            '1500-2000': [],
            '2000+': []
        };

        orders.forEach(order => {
            if (order.amount <= 500) {
                groups['100-500'].push(order);
            } else if (order.amount <= 1000) {
                groups['500-1000'].push(order);
            } else if (order.amount <= 1500) {
                groups['1000-1500'].push(order);
            } else if (order.amount <= 2000) {
                groups['1500-2000'].push(order);
            } else {
                groups['2000+'].push(order);
            }
        });

        // Filter out empty groups
        const filteredGroups = {};
        Object.keys(groups).forEach(key => {
            if (groups[key].length > 0) {
                filteredGroups[key] = groups[key];
            }
        });

        return filteredGroups;
    };

    const calculateTotalSpend = (orders) => {
        return orders.reduce((total, order) => total + order.amount, 0);
    };

    const generatePDFContent = () => {
        const groupedOrders = groupOrdersByAmount(orders);
        const totalSpend = calculateTotalSpend(orders);
        return (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text style={styles.header}>Live Life Organics</Text>
                        <Text style={styles.date}>Generated: {new Date().toLocaleString()}</Text>

                        <Text style={styles.total}>Total Spend: Rs.{totalSpend}</Text>
                        <Text style={styles.title}>Order Details by Amount Range:</Text>
                        {Object.keys(groupedOrders).map((range, index) => (
                            <View key={index} style={styles.group}>
                                <Text style={styles.groupTitle}>
                                    Amount Range: {range} (Total Spend: Rs.{calculateTotalSpend(groupedOrders[range])})
                                </Text>
                                {groupedOrders[range].map((order, orderIndex) => (
                                    <View key={orderIndex} style={styles.orderItem}>
                                        <Text>Customer: {order.customer}</Text>
                                        <Text>Amount: {order.amount}</Text>
                                        <Text>Payment ID: {order.paymentId}</Text>
                                        <Text>Status: {order.status}</Text>
                                        <Text>Address: {order.address}</Text>
                                        <Text>City: {order.city}</Text>
                                        <Text>Phone: {order.phone}</Text>
                                        <Text>Delivery Staff: {order.deliveryStaff}</Text>
                                        <Text>Chef: {order.cheff}</Text>
                                        <Text>Feedback Given: {order.isFeedbackGiven ? 'Yes' : 'No'}</Text>
                                        <Text>Time: {new Date(order.time).toLocaleString()}</Text>
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
            ) : (
                <div>
                    <PDFDownloadLink document={generatePDFContent()} fileName="orders.pdf">
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: '20px',
        padding: '20px',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    group: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottom: '1px solid #ccc',
    },
    orderItem: {
        marginBottom: 10,
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 20,
        marginBottom: 20,
    },
});

export default PDFMyOrders;
