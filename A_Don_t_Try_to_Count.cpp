#include<bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
        int n,m;
        cin>>n>>m;
        string x;
        cin>>x;
        string s;
        cin>>s;
        
        int cnt=0;
        while (x.size() <= n * m * 2) { // Ensuring we don't go into an infinite loop
            if (x.find(s) != string::npos) {
                cout << cnt << endl;
                break;
            }
            x += x; // Append x to itself
            cnt++;
        }
        if (x.find(s) == string::npos) 
            cout << -1 << endl; 

    }
    return 0;
}

