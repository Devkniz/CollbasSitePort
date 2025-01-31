const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
});

const Topic = {
    async create(title, description, userId) {
        const { data, error } = await supabase
            .from('topics')
            .insert([{ title, description, user_id: userId }]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('topics')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async update(id, title, description) {
        const { data, error } = await supabase
            .from('topics')
            .update({ title, description })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async delete(id) {
        const { data, error } = await supabase
            .from('topics')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async respond(topicId, userId, response) {
        const { data, error } = await supabase
            .from('responses')
            .insert([{ topic_id: topicId, user_id: userId, response }]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
};

module.exports = Topic;
