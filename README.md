# Laravel Client | Server Side validation with ajax form submit.

This function created as per the requirement of ajax form upload with client and server side validation.  
For this, the given below things need to be install in your project.  
- `Jquery 3.4.1` 
- `Bootstrap`
- `Jquery Validation Plugin`

## Installation

First, include the above all things in your project [Jquery 3.4.1](https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js), [Bootstrap](https://getbootstrap.com/docs/3.3/getting-started/), [Jquery Validator](https://jqueryvalidation.org/).

## Usage
Add this function in your footer and enjoy. for more parameters, read Default settings and parameter section below.
```jquery
$(/* Form ID */).commonValidator({
    rules: {
        name: {
            required: true,
        },
        // more rules
    },
    success: (response) => {
        // ajax success
    },
    error: (xhr, ajaxOptions, thrownError) => {
        // ajax error
    },
});
```
  
## Default Settings and Options
Here's the default settings used in this plugin.
### Default Settings
```jquery
defaults = {
    rules: {},
    data: 'default',
    errorType: "validator",
    showErrors: "normal",
    formAutocomplete: true,
    reponseDelay: 1000,
    useDefualtLoader: true,
    showLoadingParent: "body",
    loaderBody: '<div class="loader-wrapper" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-flow: column; text-align: center; font-weight: 600; font-size: 14px; background: rgba(255, 255, 255, 0.9); z-index: 10000000"><div style="margin-bottom: 10px; border: 5px solid #f3f3f3;border-top: 5px solid #8bc34a;border-radius: 50%;width: 40px;height: 40px;animation: spin 2s linear infinite;" id="custom-loader"></div>Submitting Form <br> please wait....</div>',
    errorCss: {
        "color": "red",
        "font-size": "13px",
        "display": "block",
        "font-weight": "600",
        "margin-top": "2px",
        "margin-bottom": "0",
    },
    beforeSubmit: function() {
        return true;
    },
    success: (response) => {
        alert("Form submitted Successfully");
    },
    error: (xhr, ajaxOptions, thrownError) => {
        alert("Form submit failed!");
    },
};
```
### Options
| Parameters | Type | Options | Description |
| :---: | :---: | :---: | :--- |
| `rules` | Object | `{}` | Here you can add all the client side rules in the **json array** format. This will work only for the client side validation. |
| `data` | Object | `{}` as `new FormData()` | This parameter is created as per the manaully form data upload requirements. If you want to creat manual data to submit then creat in this parameter as **json array** format. |
| `errorType` | String | `validator` or `custom` | This option is created for the showing errors through jquery validator or customly. Default option is `validator`. |
| `formAutocomplete` | Boolean | `true` or `false` | This option is created for form to be auto complete or not. |
| `reponseDelay` | Integer | 1000 | This option is created for putting delay in ajax request |
| `useDefualtLoader` | Boolean | `true` or `false` | This option is created for putting loader in ajax request |
| `showLoadingParent` | String | `body` | This option is created for assigning parent element where loader will display. |
| `loaderBody` | String | `` | Template for loader. Default template you can see in the Defaults Settings above. |
| `errorCss` | Object | `{}` | Error tag CSS |
| `beforeSubmit` | Function | `function(): {return true}` | This function is created for adding any functionality before submit form. |
| `success` | Function | `function(): {return true}` | This function is created for getting response of the submitted form. |
| `error` | Function | `function(): {return true}` | This function is created for getting errors of the submitted form. |



## License
[Usama Khaki](https://usamakhaki.com/) &copy; Copyright 2020
