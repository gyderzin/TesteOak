<template>
    <v-dialog v-model="dialog" width="auto" persistent>
        <v-card width="500">
            <v-card-title class="pt-4 pr-4 pl-4 title text-center">
                Olá, Sr(a) Recrutador(a)
            </v-card-title>
            <v-card-subtitle class="text-center pb-4">
                Seja bem vindo(a) ao meu projeto!
            </v-card-subtitle>

            <v-window v-model="step">
                <v-window-item :value="1">
                    <p class="px-3 text-justify text">
                        Acredito que você já tenha visto dezenas de projetos de candidatos diferentes e imagino que
                        todos são
                        muito promissores. <br>
                    </p>
                    <p class="px-3 mt-3 text-justify text">
                        Porém, meu objetivo é provar que eu sou o <b>candidato certo</b> para esta vaga. Tenho muita
                        disposição
                        e vontade de <b>aprender</b> e <b>crescer</b> junto com sua equipe de desenvolvedores.
                        Peço que permita que eu ganhe sua aprovação.
                    </p>

                    <v-form @submit.prevent ref="form">
                        <v-text-field v-model="email" class="px-4 mt-5" :rules="rules"
                            label="Insira seu e-mail para ser surpreendido" required filled type="email">
                        </v-text-field>

                        <v-row class="ma-0 pa-0">
                            <v-col class="d-flex justify-end">
                                <v-btn type="submit" class="ms-auto" :loading="loading" color="#222121"
                                    text="SURPREENDA-ME" @click="sendEmail"></v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-window-item>
                <v-window-item :value="2">
                    <p class="px-3 text-justify text">
                        Peço que dê uma olhada na sua caixa de entrada do e-mail depois de analisar meu projeto, e sinta-se a vontade para responde-lo com um feedback. Seja muito bem vindo! <br>
                    </p>
                    <v-row class="ma-0 pa-0">
                            <v-col class="d-flex justify-end">
                                <v-btn type="submit" class="ms-auto" :loading="loading" color="#222121"
                                    text="ENTRAR" @click="entrarApp"></v-btn>
                            </v-col>
                        </v-row>
                </v-window-item>
            </v-window>      
        </v-card>
    </v-dialog>
</template>
<script>
import axios from '@/plugins/axios'
export default {
    data() {
        return {
            dialog: true,
            email: '',
            rules: [
                v => {
                    if (v == '') {
                        return 'Insira seu e-mail.'
                    }
                    else if (this.errorEmail == true) {                        
                        return 'Digite um e-mail valido.'
                    } else return !!v                
                }
            ],
            step: 1,
            loading: false,
            errorEmail: false
        }
    },
    watch: {
        email() {
            if(this.errorEmail == true) this.errorEmail = false
        }
    },
    methods: {
        entrarApp() {
            localStorage.setItem('primeiroAcesso', 'false')
            this.dialog = false
        },
        async sendEmail() {
            const { valid } = await this.$refs.form.validate()
            if (valid) {
                this.loading = true
                axios.post('/enviarEmailOak', {
                    email: this.email
                }).then((res) => {
                    this.loading = false
                    if (res.data.codigo_status == 1) {
                        this.step = 2
                    } else {
                        this.errorEmail = true
                        this.$refs.form.validate()
                    }
                })
            }
        }
    }
}
</script>
<style>
.title {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.text {
    font-family: Arial, Helvetica, sans-serif;
    text-align: center
}
</style>