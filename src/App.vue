<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <!-- Componente que faz a animação dos quadrados subindo na tela -->
  <Animated></Animated>
  <v-container class="context">
    <PrimeiroAcesso v-if="primeiroAcesso == true"> </PrimeiroAcesso>
    <transition name="custom-classes" enter-active-class="animate__animated animate__backInRight"
      leave-active-class="animate__animated animate__backOutRight" mode="out-in">
      <Alert :typeAlert="typeAlert" :messageAlert="messageAlert" :alertApp="alert"></Alert>
    </transition>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-card color="white" width="100%">
          <v-row justify="space-between">

            <v-col cols="3" class="d-flex justify-start pa-0 mt-5 pl-10">
              <!-- Logo da Oak -->
              <img :width="140" src="/public/logoOak.png">
            </v-col>

            <v-col cols="3" class="d-flex justify-center mt-5  align-end">
              <h2>Lista de produtos</h2>
            </v-col>

            <v-col cols="3" class="d-flex justify-end pr-10 mt-5 align-center">
              <!-- Tooltip do botão -->
              <v-tooltip text="Cadastrar produto" location="left">
                <template v-slot:activator="{ props }">
                  <!-- Botão adicionar produto -->
                  <v-btn icon="mdi-plus" class="text-none" color="#222121" variant="flat"
                    @click="dialogAddProduto = true" v-bind="props"> </v-btn>
                </template>
              </v-tooltip>
            </v-col>

            <v-col cols="12">
              <!-- Tabela de items -->
              <v-data-table-virtual theme="light" :headers="headers" :items="produtos"
                :sort-by="[{ key: 'valor', order: 'asc' }]" show-expand item-value="descriçao"
                v-model:expanded="expanded" :no-data-text="'Cadastre novos produtos clicando no botão +'">

                <template v-slot:item.valor="{ value }">
                  <!-- Preço de cada produto -->
                  {{ value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}
                </template>

                <template v-slot:item.id="{ value }">
                  <!-- Ações de editar e deletar -->
                  <v-btn density="compact" variant="text" color="primary" class="ma-1" icon="mdi-pencil"
                    @click="openDialogEditar(value)"></v-btn>
                  <v-btn density="compact" variant="text" color="red" class="ma-1" icon="mdi-delete"
                    @click="openDialogDelete(value)"></v-btn>
                </template>

                <template v-slot:expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length" style=" background-color: whitesmoke">
                      Descrição do produto: {{ item.descriçao }}
                    </td>
                  </tr>
                </template>

              </v-data-table-virtual>
            </v-col>

            <!-- Dialog para adicionar produto -->

            <v-dialog v-model="dialogAddProduto" width="auto">
              <v-card width="500">
                <v-card-title class="text-center mt-3">
                  Cadastrar novo produto
                </v-card-title>
                <v-form @submit.prevent class="pa-5" ref="form">

                  <v-text-field v-model="cadastroProduto.nome" :rules="[v => !!v || 'Informe o nome do produto.']"
                    label="Nome do produto" variant="outlined" class="mb-3">
                  </v-text-field>


                  <v-text-field id="realNovoProduto" label="Valor do produto" v-model="cadastroProduto.valor"
                    @input="formatarValorNew" prefix="R$" type="text" required variant="outlined"
                    :rules="[v => !!v || 'Informe o valor da despesa']"></v-text-field>


                  <v-textarea variant="outlined" class="mb-1" v-model="cadastroProduto.descriçao"
                    :rules="[v => !!v || 'Escreva uma descrição para o produto.']" clear-icon="mdi-close-circle"
                    label="Descrição do produto" row-height="1" clearable>
                  </v-textarea>

                  <p>Disponível para venda?</p>
                  <v-radio-group v-model="cadastroProduto.disponivelVenda">
                    <v-radio label="Sim" value="Sim"></v-radio>
                    <v-radio label="Não" value="Não"></v-radio>
                  </v-radio-group>

                  <v-row class="pa-0 ma-0">
                    <v-col cols="6" class="mt-0 pt-0">
                      <v-btn variant="text" color="red" class="text-none" @click="resetFormCadastroProduto">
                        CANCELAR
                      </v-btn>
                    </v-col>

                    <v-col cols="6" class="d-flex justify-end mt-0 pt-0">
                      <v-btn type="submit" @click="adicionarProduto" variant="text" color="green" class="text-none">
                        SALVAR
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- Dialog para editar produto -->

            <v-dialog v-model="dialogEdit" width="auto">
              <v-card width="500">
                <v-card-title class="text-center mt-3">
                  Editar produto
                </v-card-title>
                <v-form @submit.prevent class="pa-5" ref="form">

                  <v-text-field v-model="editProduto.nome" :rules="[v => !!v || 'Informe o nome do produto.']"
                    label="Nome do produto" variant="outlined" class="mb-3">
                  </v-text-field>

                  <v-text-field id="realEditProduto" label="Valor do produto" v-model="editProduto.valor" prefix="R$"
                    type="text" @input="formatarValorEdit" required variant="outlined"
                    :rules="[v => !!v || 'Informe o valor da despesa']">
                  </v-text-field>
                  <v-textarea variant="outlined" class="mb-1" v-model="editProduto.descriçao"
                    :rules="[v => !!v || 'Escreva uma descrição para o produto.']" clear-icon="mdi-close-circle"
                    label="Descrição do produto" row-height="1" clearable>
                  </v-textarea>

                  <p>Disponível para venda?</p>
                  <v-radio-group v-model="editProduto.disponivelVenda">
                    <v-radio label="Sim" value="Sim"></v-radio>
                    <v-radio label="Não" value="Não"></v-radio>
                  </v-radio-group>

                  <v-row class="pa-0 ma-0">
                    <v-col cols="6" class="mt-0 pt-0">
                      <v-btn variant="text" color="red" class="text-none" @click="resetFormEditarProduto">
                        CANCELAR
                      </v-btn>
                    </v-col>

                    <v-col cols="6" class="d-flex justify-end mt-0 pt-0">
                      <v-btn type="submit" @click="editarProduto()" variant="text" color="green" class="text-none">
                        SALVAR
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- Dialog para deletar um produto -->

            <v-dialog v-model="dialogDelete" width="auto">
              <v-card width="500">
                <v-card-title class="text-center mt-3">
                  Deseja deletar este produto?
                </v-card-title>

                <v-table>
                  <thead>
                    <tr>
                      <th class="text-start">
                        Nome do produto
                      </th>
                      <th class="text-center">
                        Valor
                      </th>
                      <th class="text-end">
                        Disponível para venda?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-start">{{ deleteProduto.nome }}</td>
                      <td class="text-center">
                        {{ deleteProduto.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
                      <td class="text-end">{{ deleteProduto.disponivelVenda }}</td>
                    </tr>
                  </tbody>
                </v-table>

                <v-row class="pa-0 ma-0 mt-3">
                  <v-col cols="6" class="mt-0 pt-0">
                    <v-btn variant="text" color="red" class="text-none" @click="resetFormDeleteProduto()">
                      CANCELAR
                    </v-btn>
                  </v-col>

                  <v-col cols="6" class="d-flex justify-end mt-0 pt-0">
                    <v-btn type="submit" @click="deletarProduto()" variant="text" color="green" class="text-none">
                      SALVAR
                    </v-btn>
                  </v-col>

                </v-row>
              </v-card>
            </v-dialog>

          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Animated from './components/Animated.vue'
import PrimeiroAcesso from './components/PrimeiroAcesso.vue'
import Alert from './components/Alert.vue'
export default {
  components: {
    Animated, PrimeiroAcesso, Alert
  },
  created() {
    // Recuperar os produtos de localStorage caso eles existam
    let produtos = localStorage.getItem('produtos')
    let primeiroAcesso = localStorage.getItem('primeiroAcesso')
    if (produtos !== null) this.produtos = JSON.parse(produtos)
    if (primeiroAcesso == null) this.primeiroAcesso = true
    else this.primeiroAcesso = false
  },
  data() {
    return {
      // Variáveis de controle do sistema
      primeiroAcesso: undefined,
      expanded: [],
      dialogAddProduto: false,
      dialogEdit: false,
      dialogDelete: false,
      alert: false,
      typeAlert: 'success',
      messageAlert: 'Produto cadastrado com sucesso',
      cadastroProduto: {
        nome: '', descriçao: '', valor: '', disponivelVenda: 'Sim', id: ''
      },
      editProduto: {},
      deleteProduto: {},
      produtos: [],
      headers: [
        { title: 'Nome do produto', align: 'start', sortable: false, key: 'nome', },
        { title: 'Valor', key: 'valor', align: 'center' },
        { title: 'Açoes', key: 'id', align: 'end', sortable: false, },
      ]
    }
  },
  methods: {
    // Função para adicionar novo produto
    async adicionarProduto() {
      // Verificar se os campos necessários estão preenchidos
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        // Formatar o valor do produto para moeda BRL
        let dinheiroFiltrado = this.formatarValorMoeda('', this.cadastroProduto.valor)
        dinheiroFiltrado = dinheiroFiltrado.replace('.', '').replace(',', '.')
        this.cadastroProduto.valor = parseFloat(dinheiroFiltrado)

        // Inserir um id para cada produto 
        this.cadastroProduto.id = this.produtos.length + 1

        // Cadastrar o produto e salvar em localStorage
        this.produtos.push(this.cadastroProduto)
        this.resetFormCadastroProduto()
        localStorage.setItem('produtos', JSON.stringify(this.produtos))
        this.setAlert('success', 'Produto adicionado com sucesso!');
      }
    },
    // Função para editar um produto
    async editarProduto() {
      // Verificar se os campos necessários estão preenchidos
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        this.produtos.forEach((produto, i) => {
          if (produto.id == this.editProduto.id) {
            // Formatar o valor do produto para moeda BRL
            let dinheiroFiltrado = this.formatarValorMoeda('', this.editProduto.valor)
            dinheiroFiltrado = dinheiroFiltrado.replace('.', '').replace(',', '.')
            this.editProduto.valor = parseFloat(dinheiroFiltrado)

            // Cadastrar o produto e salvar em localStorage
            this.produtos[i] = this.editProduto
            localStorage.setItem('produtos', JSON.stringify(this.produtos))
            this.setAlert('info', 'Produto editado com sucesso!');
          }
        })
        this.dialogEdit = false
      }
    },
    // Função para deletar produto
    deletarProduto() {
      this.produtos.forEach((produto, i) => {
        if (produto.id == this.deleteProduto.id) {
          this.produtos.splice(i, 1)
          localStorage.setItem('produtos', JSON.stringify(this.produtos))
          this.setAlert('success', 'Produto deletadoz com sucesso!');
        }
      })
      this.dialogDelete = false
    },
    // Abrir o dialog para editar produto
    openDialogEditar(id) {
      this.editProduto = { ...this.produtos.find((produto) => produto.id == id) }
      this.editProduto.valor = String(this.editProduto.valor)
      this.formatarValorEdit
      if (!this.editProduto.valor.includes('.')) {
        this.editProduto.valor += ".00";
      }
      this.dialogEdit = true
    },
    // Abrir o dialog para deletar produto
    openDialogDelete(id) {
      this.deleteProduto = { ...this.produtos.find((produto) => produto.id == id) }
      this.dialogDelete = true
    },
    // Resetar os formulários e fechar os dialogs
    resetFormCadastroProduto() {
      this.dialogAddProduto = false
      this.cadastroProduto = {
        nome: '', descriçao: '', valor: '', disponivelVenda: 'Sim'
      }
    },
    resetFormEditarProduto() {
      this.dialogEdit = false
      this.editProduto = {}
    },
    resetFormDeleteProduto() {
      this.dialogDelete = false
    },
    setAlert(type, message) {
      this.typeAlert = type
      this.messageAlert = message
      this.alert = true
    },
    // Formatar o valor do produto a cada clique para formato da moeda BRL
    formatarValorNew(event) {
      let valor = event.target.value.replace(/\D/g, '');
      if (valor !== '') {
        valor = (parseFloat(valor) / 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      this.cadastroProduto.valor = valor;
    },
    formatarValorEdit(event) {
      let valor = event.target.value.replace(/\D/g, '');
      if (valor !== '') {
        valor = (parseFloat(valor) / 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      console.log(valor)
      this.editProduto.valor = valor;
    },
    // Formatar o valor antes de adicionar novo produto
    formatarValorMoeda(id, num = '') {
      let el = ''
      let v = undefined
      if (id !== '') {
        el = document.getElementById(id)
        v = el.value.replace(/\D/g, '');
        v = (v / 100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        el.value = v;
      } else {
        el = num
        v = el.replace(/\D/g, '');
        v = (v / 100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        el = v;
        return el
      }
    },   
  },
  watch: {
      alert(newVal) {
        if(newVal == true) {
          setTimeout(() => {
            this.alert = false
          }, 4000)
        }
      }
    }
}
</script>
