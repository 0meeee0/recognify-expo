import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Text, View, Image } from 'react-native';

export default function AttendanceLogsScreen() {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/attendance/')
      .then(response => response.json())
      .then(data => {
        setAttendanceLogs(data.attendace);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Image
        source={{ uri: `http://localhost:3001/students/${item?.student?.imagePath.split('/').pop()}` }}
        style={styles.studentImage}
        resizeMode="cover"
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item?.student?.name}</Text>
        <Text style={styles.attendanceDate}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <FlatList
      data={attendanceLogs}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  attendanceDate: {
    color: '#777',
    marginTop: 4,
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#d9534f',
  },
});
