<template>
    <div class="login-container">
        <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
        </div>
        <form>
            <h3>Login Here</h3>

            <label for="email">Email</label>
            <input type="text" placeholder="Email" id="email" v-model="email">

            <label for="password">Password</label>
            <input type="password" placeholder="Password" id="password" v-model="password">

            <button @click="login" :disabled="btnDisable || (email.length < 1)">Log In</button>
            <div class="flex justify-center">
                <router-link class="mt-4 hover:text-blue-500" to="/signup">Go to register users page</router-link>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            email: '',
            password: null,
            btnDisable: false,
        }
    },
    methods: {
        login(event) {
            if (event) {
                event.preventDefault();
            }
            const payload = {
                email: this.email,
                password: this.password
            }
            this.btnDisable = true;
            this.$axios.post('/login', payload)
                .then(() => {
                    this.$notyf.success("Login Successfully");
                    this.email = "";
                    this.password = null;
                    this.$router.push('/chat');
                })
                .finally(() => {
                    this.btnDisable = false;
                })
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.$router.push('/chat');
        }
    }
}
</script>
<style scoped>
.login-container {
    background-color: #080710;
    width: 100%;
    height: 100vh;
}

.background {
    width: 430px;
    height: 520px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
}

.background .shape {
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
}

.shape:first-child {
    background: linear-gradient(#1845ad,
            #23a2f6);
    left: -80px;
    top: -80px;
}

.shape:last-child {
    background: linear-gradient(to right,
            #ff512f,
            #f09819);
    right: -30px;
    bottom: -80px;
}

form {
    height: 520px;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.13);
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    padding: 50px 35px;
}

form * {
    color: #ffffff;
    outline: none;
    border: none;
}

form h3 {
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
}

label {
    display: block;
    margin-top: 30px;
    font-size: 16px;
    font-weight: 500;
}

input {
    display: block;
    height: 50px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 3px;
    padding: 0 10px;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 300;
}

::placeholder {
    color: #e5e5e5;
}

button {
    margin-top: 50px;
    width: 100%;
    background-color: #ffffff;
    color: #080710;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
}

@media (max-width: 768px) {
    form {
        width: 90%;
    }

    .background {
        left: 35px;
    }
}
</style>