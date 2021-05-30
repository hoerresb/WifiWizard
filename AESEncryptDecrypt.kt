
fun encrypt(context:Context, strToEncrypt: String): ByteArray {
    val plainText = strToEncrypt.toByteArray(Charsets.UTF_8)
    val keygen = KeyGenerator.getInstance("AES")
    keygen.init(256)
    val key = keygen.generateKey()
    saveSecretKey(context, key)
    val cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING")
    cipher.init(Cipher.ENCRYPT_MODE, key)
    val cipherText = cipher.doFinal(plainText)
    saveInitializationVector(context, cipher.iv)

    val sb = StringBuilder()
    for (b in cipherText) {
        sb.append(b.toChar())
    }
    Toast.makeText(context, "dbg encrypted = [" + sb.toString() + "]", Toast.LENGTH_LONG).show()

    return cipherText
}

fun decrypt(context:Context, dataToDecrypt: ByteArray): ByteArray {
    val cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING")
    val ivSpec = IvParameterSpec(getSavedInitializationVector(context))
    cipher.init(Cipher.DECRYPT_MODE, getSavedSecretKey(context), ivSpec)
    val cipherText = cipher.doFinal(dataToDecrypt)

    val sb = StringBuilder()
    for (b in cipherText) {
        sb.append(b.toChar())
    }
    Toast.makeText(context, "dbg decrypted = [" + sb.toString() + "]", Toast.LENGTH_LONG).show()

    return cipherText
}

fun saveSecretKey(context:Context, secretKey: SecretKey) {
    val baos = ByteArrayOutputStream()
    val oos = ObjectOutputStream(baos)
    oos.writeObject(secretKey)
    val strToSave = String(android.util.Base64.encode(baos.toByteArray(), android.util.Base64.DEFAULT))
    val sharedPref = PreferenceManager.getDefaultSharedPreferences(context)
    val editor = sharedPref.edit()
    editor.putString("secret_key", strToSave)
    editor.apply()
}

fun getSavedSecretKey(context: Context): SecretKey {
    val sharedPref = PreferenceManager.getDefaultSharedPreferences(context)
    val strSecretKey = sharedPref.getString("secret_key", "")
    val bytes = android.util.Base64.decode(strSecretKey, android.util.Base64.DEFAULT)
    val ois = ObjectInputStream(ByteArrayInputStream(bytes))
    val secretKey = ois.readObject() as SecretKey
    return secretKey
}

fun saveInitializationVector(context: Context, initializationVector: ByteArray) {
    val baos = ByteArrayOutputStream()
    val oos = ObjectOutputStream(baos)
    oos.writeObject(initializationVector)
    val strToSave = String(android.util.Base64.encode(baos.toByteArray(), android.util.Base64.DEFAULT))
    val sharedPref = PreferenceManager.getDefaultSharedPreferences(context)
    val editor = sharedPref.edit()
    editor.putString("initialization_vector", strToSave)
    editor.apply()
}

fun getSavedInitializationVector(context: Context) : ByteArray {
    val sharedPref = PreferenceManager.getDefaultSharedPreferences(context)
    val strInitializationVector = sharedPref.getString("initialization_vector", "")
    val bytes = android.util.Base64.decode(strInitializationVector, android.util.Base64.DEFAULT)
    val ois = ObjectInputStream(ByteArrayInputStream(bytes))
    val initializationVector = ois.readObject() as ByteArray
    return initializationVector
}
