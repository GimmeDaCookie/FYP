import { Dimensions, StyleSheet } from 'react-native';
import colors from '../colors';

export default StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      height: 58,
      width: Dimensions.get('window').width - 32,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
      alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      header: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        backgroundColor: colors.mediumGray,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      listItem: {
        padding: 16,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
      },
      listItemText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
      },
      listItemSubtext: {
        fontSize: 12,
        color: '#666',
      },
  });