<template>
  <component
    :is="tag"
    class="ww-button"
    :class="{ button: tag }"
    :type="buttonType"
    :style="buttonStyle"
    :data-ww-flag="'btn-' + content.buttonType"
    :disabled="content.disabled"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @focus="isFocused = true"
    @blur="isFocused = false"
  >
    <template v-if="!content.showLoader">
      <wwElement
        v-if="content.hasLeftIcon && content.leftIcon"
        v-bind="content.leftIcon"
      ></wwElement>
      <wwText tag="span" :text="text"></wwText>
      <wwElement
        v-if="content.hasRightIcon && content.rightIcon"
        v-bind="content.rightIcon"
      ></wwElement>
    </template>
    <div v-if="content.showLoader" class="loader-container">
      <div class="loader"></div>
    </div>
  </component>
</template>

<script>
const TEXT_ALIGN_TO_JUSTIFY = {
  center: "center",
  right: "flex-end",
  left: "flex-start",
  justify: "center",
};
export default {
  props: {
    content: { type: Object, required: true },
    wwFrontState: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: [
    "update:content",
    "update:content:effect",
    "change-menu-visibility",
    "change-borders-style",
    "add-state",
    "remove-state",
  ],
  data() {
    return { isPressed: false, isFocused: false };
  },
  computed: {
    buttonStyle() {
      return {
        justifyContent:
          TEXT_ALIGN_TO_JUSTIFY[this.content.textAlign] || "center",
        "--border-style": this.content.borderStyle,
        "--font-size":
          this.content.labelStyle && this.content.labelStyle.fontSize
            ? this.content.labelStyle.fontSize
            : "inherit",
        "--padding":
          this.content.labelStyle && this.content.labelStyle.padding
            ? this.content.labelStyle.padding
            : "inherit",

        "--loader-size": this.content.loaderSize + "px",
        "--loader-color": this.content.loaderColor,
        "--loader-width": this.content.loaderWidth + "px",
        "--loader-speed": (1 / this.content.loaderSpeed) * 1000 + "ms",
        "--column-gap": this.content.columnGap,
      };
    },
    isEditing() {
      /* wwEditor:start */
      return (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION
      );
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
    tag() {
      if (this.isEditing) return "div";
      if (
        this.content.buttonType === "submit" ||
        this.content.buttonType === "reset" ||
        this.content.buttonType === "button"
      )
        return "button";
      return "div";
    },
    buttonType() {
      if (this.isEditing) return "";
      if (
        this.content.buttonType === "submit" ||
        this.content.buttonType === "reset" ||
        this.content.buttonType === "button"
      )
        return this.content.buttonType;
      return "";
    },
    text() {
      return this.wwElementState.props.text;
    },
  },
  watch: {
    /* wwEditor:start */
    isPressed: {
      immediate: true,
      handler(value) {
        if (value) {
          this.$emit("add-state", "Pressed");
        } else {
          this.$emit("remove-state", "Pressed");
        }
        this.$nextTick(() => {
          this.handleObserver();
        });
      },
    },
    isFocused: {
      immediate: true,
      handler(value) {
        if (value) {
          this.$emit("add-state", "Focus");
        } else {
          this.$emit("remove-state", "Focus");
        }
        this.$nextTick(() => {
          this.handleObserver();
        });
      },
    },
    "content.hasRightIcon": {
      async handler(hasRightIcon) {
        if (this.wwEditorState.isACopy) {
          return;
        }
        if (hasRightIcon && !this.content.rightIcon) {
          const uid = await wwLib.wwObjectHelper.create(
            "ww-icon",
            {},
            {},
            this.wwFrontState.sectionId
          );
          this.$emit("update:content:effect", {
            rightIcon: { uid, isWwObject: true },
          });
        }
      },
    },
    "content.hasLeftIcon": {
      async handler(hasLeftIcon) {
        if (this.wwEditorState.isACopy) {
          return;
        }
        if (hasLeftIcon && !this.content.leftIcon) {
          const uid = await wwLib.wwObjectHelper.create(
            "ww-icon",
            {},
            {},
            this.wwFrontState.sectionId
          );
          this.$emit("update:content:effect", {
            leftIcon: { uid, isWwObject: true },
          });
        }
      },
    },
    /* wwEditor:end */
    "content.disabled": {
      immediate: true,
      handler(value) {
        if (value) {
          this.$emit("add-state", "disabled");
        } else {
          this.$emit("remove-state", "disabled");
        }
      },
    },
  },
  methods: {
    onMouseDown() {
      this.isPressed = true;
    },
    onMouseUp() {
      this.isPressed = false;
    },
    handleObserver() {
      if (!this.isMounted) return;
      if (this.resizeObserverContent) this.resizeObserverContent.disconnect();
      if (this.resizeObserverBorder) this.resizeObserverBorder.disconnect();
      const el = this.$refs.input;
      if (!el) return;
      // We need both Observers because one of them works outside a ww-modal, while the other in a ww-modal
      this.resizeObserverContent = new ResizeObserver(() => {
        this.updatePosition(el);
      });
      this.resizeObserverBorder = new ResizeObserver(() => {
        this.updatePosition(el);
      });
      this.resizeObserverContent.observe(el, { box: "content-box" });
      this.resizeObserverBorder.observe(el, { box: "border-box" });
    },
    /* wwEditor:start */
    selectParentFormContainer() {
      const parentUid = wwLib.selectParentByFlag(this.$el, "form-container");
      if (!parentUid) {
        wwLib.wwNotification.open({
          text: {
            en: "No parent form container found. Please, add this submit button into a form container.",
            fr: "Aucun formulaire parent trouvé. Veuillez intégrer ce bouton submit dans un form container.",
          },
          color: "yellow",
          duration: 6000,
        });
      }
    },
    /* wwEditor:end */
  },
};
</script>

<style lang="scss" scoped>
.ww-button {
  display: flex;
  justify-content: center;
  align-items: center;
  &.button {
    outline: none;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
  }
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .loader {
    border: var(--loader-width) solid var(--loader-color);
    border-radius: 100%;
    width: var(--loader-size);
    height: var(--loader-size);
    animation: spin var(--loader-speed) linear infinite;
    clip-path: polygon(100% 0, 100% 100%, 50% 50%, 0 100%, 0 0);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
