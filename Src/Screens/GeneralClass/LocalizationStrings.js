import LocalizedStrings from 'react-native-localization';

let Localization = new LocalizedStrings({
    en:{
        //Common Text
        AppName:'Mercado_Angola',
        noNetworkText:'Please check your internet connectivity',
        okText:'Okay',
        cancelText:'Cancel',
        closedText:'Closed',
        noText:'No',
        yesText:'Yes',
        loadingText:'Loading...',
        SubmitText:'Submit',
        SubmitCapText:'SUBMIT',


        //Login Screen
        LoginTitle:'LOGIN',
        emailText:'Email',
        passwordText:'Password',
        fPasswordText:'Forgot Password',
        signInText:'SIGN IN',
        dontHaveAccText:'Don\'t have an account ?',
        signUpText:'SIGN UP',
        emailAddressText:'Email Address',
        enterEmailText:'Please enter email',
        enterValidEmailText:'Please enter valid email',
        enterPasswordText:'Please enter password',

        // SignUp Screen
        userTypeText:'User Type',
        userText:'User',
        vendorText:'Vendor',
        businessText:'Business Name',
        nameText:'Name',
        addressText:'Address',
        contactText:'Contact',
        passwordText:'Password',
        cPasswordText:'Confirm Password',
        selAddressText:'SELECT ADDRESS',
        takePhoto:'Take Photo',
        cfLibrary:'Choose from Library',
        cameraPermissionText:'Camera permission not allowed, Please allow camera permission from setting.',
        galleryPermissionText:'Gallery permission not allowed, Please allow gallery permission from setting.',
        vUserTypeText:'Please select user Type',
        vBNameText:'Please enter business name',
        vNameText:'Please enter name',
        vAddressText:'Please select address',
        vEmailText:'Please enter email',
        vvEmailText:'Please enter valid email',
        vIndustryText:'Please select industry',
        vContactText:'Please enter contact',
        vvContactText:'Contact number should be 9 digits long.',
        vPasswordText:'Please enter password',
        vvPasswordText:'Password should be greater than or equal to 6 digit',
        vvFormatPasswordText:'Password must be 6 to 16 character long and atleast one special character and digit contains',
        vCPassword:'Please enter confirm password',
        vPCPText:'Password and Confirm Password must be matched',
        industryText:'Industry',

        //Menu Screen
        switchText:'Switch',
        profileText:'Profile',
        homeText:'Home',
        settingsText:'Settings',
        aboutUsText:'About Us',
        helpText:'Help',
        logoutText:'Logout',
        vSwitchUserText:'You are currently end user, are you sure to become vendor?',
        vSwitchVendorText:'You are currently vendor, are you sure to become end user?',
        userTypeChText:'User Type Change',
        vLogoutText:'Are you sure you want to signout?',

        //ProfileVendor Screen
        profileCapText:'Profile',
        descText:'Description',
        fLinkText:'Facebook Link',
        tLinkText:'Twitter Link',
        gLinkText:'Google Link',
        pNumberText:'Phone Number',
        saveText:'SAVE',
        chPasswordText:'Change Password',
        oldPasswordText:'Old Password',
        newPasswordText:'New Password',
        confirmNewPassText:'Confirm New Password',
        vOldPassText:'Please enter old password',
        vPasswordText:'Please enter password',
        vEditProfileText:'Please click on edit icon to edit details',
        vDescriptionText:'Please enter description',
        industryPlaceHolderText:'Profession Type / Industry',

        //Settings Screen
        settingsTitle:'SETTINGS',
        distanceText:'Distance',
        areaOfInterestText:'Areas of Interest/Industry',
        renewSubText:'RENEW SUBSCRIPTION',
        vActivePlan:'You have active plan right now, so you can\'t purchase plan',

        //SubscriptionPlanList
        subscriptionTitle:'SUBSCRIPTION',
        payNowText:'PAY NOW',

        //Payment Confirm
        paymentConfirmTitle:'PAYMENT CONFIRM',
        backText:'BACK',
        confirmText:'CONFIRM',
        paymentText1:'Please use below reference code in your transaction:',
        paymentText2:'Please press confirm button after made your transaction successfully on machine.',
        paymentText3:'Please don\'t press back button or cancel while we are generating reference.',

        //About Us
        aboutUsCapText:'ABOUT US',

        //Help Screen
        helpCapText:'HELP',

        //Dashboard Screen
        homeTitle:'DASHBOARD',
        searchText:'Search',
        locationText1:'App needs to access your location',
        locationText2:'so we can find near your professional ',
        vSearchText:'Please enter text to search professional',

        //Filter Screen
        filterTitle:'FILTER',
        ratingAtList:'Rating at List',
        kmText:'km',
        selectIndustryText:'Select Industry',

        //Professional List Screen
        pListTitle:'PROFESSIONAL LISTING',

        //Professional Profile Screen
        callText:'Call',
        reviewText:'Review',
        reviewsText:'Reviews',
        aboutText:'About',
        galleryText:'Gallery',
        noDescriptionText:'There is no any description about vendor',
        noImageText:'Vendor has no image upload yet.',
        noReviewText:'Vendor has no review yet.',
        noCallText:'Call features is not supported by device',
        noFeatureSupportedText:'This featues is not supported by your device',
        notSetUrlText:'Vendor has not set url',

        //Give Review Screen
        giveReviewTitle:'GIVE REVIEW',
        ratingsCaptionText:'Please select Ratings:',
        descriptionCaptionText:'Description:',
        descriptionPlaceholderText:'Write your description here',
        vRatingsText:'Please select ratings.',

        //Category Screen
        categoryTitle:'CATEGORY',

    },
    pt:{
        //Common Text
        AppName:'Mercado_Angola',
        noNetworkText:'Verifique sua conexão internet',
        okText:'OK',
        cancelText:'Cancelar',
        closedText:'Closed',
        noText:'No',
        yesText:'Yes',
        loadingText:'Loading...',
        SubmitText:'Submeter',
        SubmitCapText:'Submeter',


        //Login Screen
        LoginTitle:'LOGIN',
        emailText:'Email',
        passwordText:'Senha',
        fPasswordText:'Esqueceu a Senha?',
        signInText:'Sign in',
        dontHaveAccText:'Ainda não tem conta?',
        signUpText:'Abrir uma conta',
        emailAddressText:'Endereço email',
        enterEmailText:'Inserir o email',
        enterValidEmailText:'Inserir email valido',
        enterPasswordText:'Inserir a senha',

        // SignUp Screen
        userTypeText:'Tipo de usuario',
        userText:'Usuario',
        vendorText:'Vendedor',
        businessText:'Nome da Empresa/Pessoal',
        nameText:'Nome',
        addressText:'Endereço',
        contactText:'Contacto',
        passwordText:'Senha',
        cPasswordText:'Confirmar senha',
        selAddressText:'Selecione o endereço',
        takePhoto:'Tirar Foto',
        cfLibrary:'Escolher da Galeria',
        cameraPermissionText:'Camera sem permissao. Favor permitir dar permissao a camera a partir do menu configuraçao',
        galleryPermissionText:'Camera sem permissao. Favor permitir dar permissao a camera a partir do menu configuraçao',
        vUserTypeText:'Selectionar o tipo de usuario',
        vBNameText:'Inserir nome da empresa ou individual',
        vNameText:'Nome',
        vAddressText:'Selecione o endereço',
        vEmailText:'Inserir o email',
        vvEmailText:'Inserir email valido',
        vIndustryText:'Selecione a industria',
        vContactText:'Inserir o contacto',
        vvContactText:'Numero de Contato necessita 9 digitos',
        vPasswordText:'Inserir a senha',
        vvPasswordText:'Senha deve ter 6 ou mais digitos',
        vvFormatPasswordText:'Senha deve ter 6 a 16 caracteres, pelo menos um caracter especial',
        vCPassword:'Confirmar senha',
        vPCPText:'Senha e Confirmar a senha devem ser a mesma',
        industryText:'industria',

        //Menu Screen
        switchText:'Mudar',
        profileText:'Perfil',
        homeText:'Home',
        settingsText:'Configurações',
        aboutUsText:'Sobre nos',
        helpText:'Ajuda',
        logoutText:'Sair',
        vSwitchUserText:'É comprador de serviços, quer se tornar vendedor de serviços?',
        vSwitchVendorText:'É vendedor de serviços, quer se tornar comprador de serviços?',
        userTypeChText:'Mudar tipo de usuario',
        vLogoutText:'Quer Sair?',

        //ProfileVendor Screen
        profileCapText:'Perfil',
        descText:'Descrição',
        fLinkText:'Facebook Link',
        tLinkText:'Twitter Link',
        gLinkText:'Google Link',
        pNumberText:'Numero de telefone',
        saveText:'SALVAR',
        chPasswordText:'Alterar senha',
        oldPasswordText:'Senha antiga',
        newPasswordText:'Nova senha',
        confirmNewPassText:'Confirmar nova senha',
        vOldPassText:'Inserir a senha antiga',
        vPasswordText:'Inserir a senha',
        vEditProfileText:'Clicar no icon Detalhes para editar detalhes',
        vDescriptionText:'Inserir a descrição',
        industryPlaceHolderText:'Profissão Type / industria',

        //Settings Screen
        settingsTitle:'Configurações',
        distanceText:'Distancia',
        areaOfInterestText:'Areas de interesse/industria',
        renewSubText:'Renovar o seu plano',
        vActivePlan:'Tem um plano ativo, não pode ativar outro plano',

        //SubscriptionPlanList
        subscriptionTitle:'PLANOS',
        payNowText:'PAGAR AGORA',

        //Payment Confirm
        paymentConfirmTitle:'CONFIRMAR PAGAMENTO',
        backText:'RETROCEDER',
        confirmText:'CONFIRMAR',
        paymentText1:'Usar este condigo de referencia no seu pagamento',
        paymentText2:'Favor clicar o botão confirmar após fazer pagamento no ATM',
        paymentText3:'Favor nao clicar no botão retroceder enquanto o codigo esta sendo gerado',

        //About Us
        aboutUsCapText:'SOBRE NOS',

        //Help Screen
        helpCapText:'AJUDA',

        //Dashboard Screen
        homeTitle:'DASHBOARD',
        searchText:'Procura',
        locationText1:'App precisa ter aceso a sua localização',
        locationText2:'Procurar um professional proximo',
        vSearchText:'Inserir texto para procurar um professional',

        //Filter Screen
        filterTitle:'FILTER',
        ratingAtList:'Avaliação',
        kmText:'KM',
        selectIndustryText:'Selectionar industria',

        //Professional List Screen
        pListTitle:'LISTAGEM PROFESSIONAIS',

        //Professional Profile Screen
        callText:'Ligar',
        reviewText:'Rever',
        reviewsText:'Avaliação',
        aboutText:'Sobre',
        galleryText:'Galeria',
        noDescriptionText:'Não existe informação sobre o vendedor',
        noImageText:'Vendedor nao tem imagem inserida',
        noReviewText:'Vendedor nao possui avaliação',
        noCallText:'Chamada não suportada pelo seu aparelho',
        noFeatureSupportedText:'Funcionalidade não suportada pelo seu aparelho',
        notSetUrlText:'Vendedor não tem URL',

        //Give Review Screen
        giveReviewTitle:'AVALIE',
        ratingsCaptionText:'Selecionar a avaliação',
        descriptionCaptionText:'Descrição',
        descriptionPlaceholderText:'Descrever-se aqui',
        vRatingsText:'Selecionar a avaliação',

        //Category Screen
        categoryTitle:'Category',
    }
});

module.exports = {
   LString: Localization,
}
