<script>
import registerForm from '../components/registerForm.vue'
export default {
    components:{registerForm},  
    data(){
        return{
            actionlink: 'link'
        }
    }
}
</script>

<template >

    <register-form :actionlink="actionlink"></register-form>
    
</template>