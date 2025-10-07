
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record: user } = await req.json()

    if (!user) {
      throw new Error('User data not provided in the request body')
    }

    const { id, email, raw_user_meta_data } = user
    const { full_name, company_name } = raw_user_meta_data || {}

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: id,
          email: email,
          full_name: full_name,
          company_name: company_name,
        },
      ])

    if (error) {
      console.error('Error inserting user profile:', error)
      throw error
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
