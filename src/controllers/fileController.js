const { v4: uuidv4 } = require('uuid');
// const supabase = require('../config/database');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Vérifie que les variables sont bien définies
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ ERROR: Supabase credentials are missing");
    process.exit(1);  // Arrête le serveur si les credentials ne sont pas chargés
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            console.error('No file provided');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Générer un nom unique pour le fichier
        const fileKey = `${uuidv4()}-${file.originalname}`;

        console.log('Generated File Key:', fileKey);

        // Uploader vers Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileKey, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ message: 'Failed to upload file to Supabase' });
        }

        console.log('Upload data:', uploadData);

        // Récupérer l'URL publique
        const { publicURL } = supabase.storage.from('documents').getPublicUrl(uploadData.path);
        console.log('Generated Public URL:', publicURL);

        // Générer une URL signée si nécessaire
        const { data: signedURLData, error: signedURLError } = await supabase.storage
            .from('documents')
            .createSignedUrl(uploadData.path, 60); // URL signée valable 60 secondes

        if (signedURLError) {
            console.error('Supabase signed URL error:', signedURLError);
            return res.status(500).json({ message: 'Failed to generate signed URL' });
        }

        console.log('Signed URL data:', signedURLData);

        res.status(200).json({ message: 'File uploaded successfully', publicURL, signedURL: signedURLData.signedURL });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
    res.json({ message: "Upload file endpoint" });
};

exports.getFiles = async (req, res) => {
    try {
        const { data: documents, error } = await supabase
            .from('documents')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        res.render('files', { documents });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
    res.json({ message: "Get my files endpoint" });
};

console.log("📌 Supabase instance:", supabase);
console.log("📌 Supabase storage:", supabase.storage);
