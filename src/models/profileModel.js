const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Charge les variables d'environnement

// Initialise Supabase avec les variables d'environnement
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const Profile = {
    getByUserId: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profile_informations')  // Assure-toi que la table s'appelle bien 'profile_informations'
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }
};

module.exports = Profile;
