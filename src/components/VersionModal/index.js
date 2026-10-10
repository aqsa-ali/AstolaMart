import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import Modal from 'react-native-modal';
// import {colors} from '../../services/colors';

const ANDROID_STORE_URL =
  'https://www.google.com/';

const IOS_STORE_URL =
  'https://www.google.com/';

export default function VersionModal({
  visible,
  message,
}) {
  console.log('VersionModal visible =>', visible);
  console.log('VersionModal message =>', message);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => { }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Update required
        </Text>

        <Text style={styles.message}>
          {message}
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => {
            void Linking.openURL(
              Platform.OS === 'ios'
                ? IOS_STORE_URL
                : ANDROID_STORE_URL,
            );
          }}
        >
          <Text style={styles.buttonText}>
            Update now
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 24,
    justifyContent: 'center',
  },

  card: {
    // backgroundColor: colors.THEME_WHITE,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderWidth: 1,
    // borderColor: colors.THEME_BORDER,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    // color: colors.THEME_TEXT,
    textAlign: 'center',
    marginBottom: 12,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,
    // color: colors.THEME_TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 24,
  },

  button: {
    // backgroundColor: colors.THEME_PRIMARY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },

  buttonText: {
    // color: colors.THEME_WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});