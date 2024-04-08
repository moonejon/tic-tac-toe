import React, { useState } from 'react';

const SignUp = () => {
    const [user, setUser] = useState(null);

    const signUp = () => {};

    return (
        <div className="signUp">
            <label> Sign Up</label>
            <input type="text" placeholder="Username"  onChange={(event) => {
                setUser({...user, username: event.target.value});
            }}/>
            <input type="password" placeholder="Password" onChange={(event) => {
                setUser({...user, password: event.target.value});
            }}/>
            <button onChange={signUp}>Sign Up</button>
        </div>
    );
};

export default SignUp;