Go to your GitHub repo:

Settings → Secrets and variables → Actions → New repository secret

Add two secrets:

Name: VITE_SUPABASE_URL → Value: https://something.supabase.co
Name: VITE_SUPABASE_KEY → Value: your anon key

That's it. The ${{ secrets.VITE_SUPABASE_URL }} in the workflow automatically pulls from there during build.