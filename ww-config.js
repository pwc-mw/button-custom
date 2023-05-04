const INFO = {
  submit: "sub",
  reset: "rst",
  button: "btn",
};

export default {
  inherit: "ww-text",
  options: {
    autoByContent: true,
    hyperlink: true,
    disableLink: (content) => content.disabled,
  },
  editor: {
    label: {
      en: "Button",
      fr: "Bouton",
    },
    icon: "cursor-click",
    infoTags: (content) => {
      if (content.buttonType && INFO[content.buttonType]) {
        return {
          color: "var(--ww-color-blue-500)",
          backgroundColor: "var(--ww-color-blue-100)",
          text: INFO[content.buttonType].toUpperCase(),
          action: () => {
            wwLib.wwSearchBar.executeAction({
              actions: wwLib.wwSearchBar.getEditSidebarActions(
                "settings",
                "custom-0"
              ),
            });
          },
        };
      } else {
        return [];
      }
    },
    workflowHint: (content) => {
      if (content.buttonType !== "submit") {
        return false;
      }

      return {
        type: "warning",
        header: {
          en: "You probably shouldn’t trigger workflows on submit buttons.",
          fr: "Vous ne devriez pas déclencher un workflow depuis un bouton submit",
        },
        text: {
          en: "For your users to benefit from automatic form field validation, you should trigger submit workflows on the form container. Unless you are 100% sure of what you’re doing and want to bypass this behavior.",
          fr: "Pour que vos utilisateurs bénéficient de la validation automatique des champs de formulaire, vous devez déclencher des workflows de soumission sur le conteneur de formulaire. À moins que vous ne soyez sûr à 100 % de ce que vous faites et que vous souhaitiez contourner ce comportement.",
        },
        button: {
          text: {
            en: "Select form container",
            fr: "Selectionnez le form container",
          },
          action: "selectParentFormContainer",
        },
      };
    },
  },
  properties: {
    showLoader: {
      label: { en: "Show loader" },
      type: "OnOff",
      states: true,
      defaultValue: false,
      bindable: true,
    },
    loaderSize: {
      label: { en: "Loader Size" },
      type: "Number",
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: 20,
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "A number that defines the icon size: `12`",
      },
      /* wwEditor:end */
    },
    loaderWidth: {
      label: { en: "Loader Width" },
      type: "Number",
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: 2,
    },
    loaderSpeed: {
      label: { en: "Loader Speed" },
      type: "Number",
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: 1,
    },
    loaderColor: {
      label: { en: "Loader color" },
      type: "Color",
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: "#000000",
    },
    backgroundColor: {
      label: {
        en: "Text Background",
        fr: "Background du Texte",
      },
      type: "Color",
      options: {
        nullable: true,
      },
      bindable: true,
      responsive: true,
      states: true,
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: "color",
        type: "string",
        tooltip:
          'A string that represents a color code: `"rebeccapurple" | "#00ff00" | "rgb(214, 122, 127)"`',
      },
      /* wwEditor:end */
    },
    buttonType: {
      label: {
        en: "Type",
        fr: "Type",
      },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: null, label: "none" },
          { value: "button", label: "Button" },
          { value: "submit", label: "Submit Button" },
        ],
      },
      defaultValue: "button",
    },
    disabled: {
      label: { en: "Disabled" },
      type: "OnOff",
      section: "settings",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip:
          "A boolean that defines if the button is disabled: `true | false`",
      },
      /* wwEditor:end */
    },
    hasLeftIcon: {
      label: { en: "Left icon", fr: "Icône gauche" },
      section: "settings",
      type: "OnOff",
    },
    leftIcon: {
      hidden: true,
    },
    hasRightIcon: {
      label: { en: "Right icon", fr: "Icône droite" },
      type: "OnOff",
      section: "settings",
    },
    rightIcon: {
      hidden: true,
    },
  },
};
