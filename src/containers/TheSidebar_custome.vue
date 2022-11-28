<template>
  <CSidebar
    color-scheme="dark"
    style="background-color: #000060"
    class="bg-theme"
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand to="/">
      <div
        class="col-sm-12"
        style="background-color: #000060"
        id="app_image"
        ref="app_image"
      >
        <img
          v-bind:src="entityLogo"
          style="
            width: 90px;
            heigth: auto;
            display: block;
            margin: auto;
            padding-top: 14px;
          "
        />
      </div>
    </CSidebarBrand>
    <!-- <CRenderFunction flat :content-to-render="nav" /> -->
    <nav class="navigation">
      <ul class="mainmenu" v-for="(item, index) in navMenu" :key="index">
        <li>
          <!-- MENU WITHOUT CHILD -->
          <a
            v-if="item.link"
            @click="handleClickParentMenu(item, index)"
            :href="`#${item.link}`"
            :class="{ 'active-parent': item.link == `/${part_path[1]}` }"
          >
            <CIcon :name="item.icon" class="icon-style" />
            &nbsp;&nbsp;&nbsp;{{ item.name }}
          </a>
          <!-- MENU WITHOUT CHILD -->

          <!-- MENU WITH CHILD -->
          <a
            v-if="!item.link"
            @click="handleClickParentMenu(item, index)"
            :class="{ 'expand-parent': item.expand }"
          >
            <CIcon :name="item.icon" class="icon-style" />
            &nbsp;&nbsp;&nbsp;{{ item.name }}
            <v-icon
              :name="item.expand ? 'chevron-down' : 'chevron-left'"
              class="float-right"
              scale="0.6"
              style="margin-top: 7px"
            />
          </a>
          <ul
            class="submenu"
            v-for="(child_item, child_index) in item.items"
            :key="child_index"
            :style="item.expand ? 'max-height: 200px;' : ''"
          >
            <li>
              <a
                :href="`#${child_item.link}`"
                :class="{
                  'active-child':
                    child_item.link == `/${part_path[1]}/${part_path[2]}`,
                }"
              >
                <span> </span>
                <CIcon :name="child_item.icon" />
                &nbsp;&nbsp;&nbsp;{{ child_item.name }}
              </a>
            </li>
          </ul>
          <!-- MENU WITH CHILD -->
        </li>
      </ul>
    </nav>
  </CSidebar>
</template>

<script>
import nav from "./_nav";

export default {
  data() {
    return {
      userPermission: [],
      nav: nav,
      entityLogo: null,
      navMenu: [],
      backupNavMenu: [],
      full_path: null,
      part_path: [],
    };
  },
  name: "TheSidebar",
  mounted() {
    this.navMenu = this.renderMenu();
    this.entityLogo = localStorage.getItem("app_image");
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        // this.full_path = route.matched[1];
        this.full_path = route.path;
        this.part_path = this.full_path.split("/");
      },
    },
    show: {
      immediate: true,
      handler(n, o) {},
    },
  },
  methods: {
    renderMenu() {
      let menus = [];
      if (this.backupNavMenu.length === 0) {
        for (const it of this.nav[0]._children[0]._children) {
          let menu = it;
          menu.expand = false;
          menus.push(menu);
        }
        this.backupNavMenu = menus;
      } else {
        menus = this.backupNavMenu;
      }
      menus = JSON.stringify(menus);
      return JSON.parse(menus);
    },
    getExpandMenu(index) {
      if (this.navMenu[index].expand == true) {
        this.navMenu[index].expand = false;
        return;
      }
      this.navMenu = this.renderMenu();
      this.navMenu[index].expand = !this.navMenu[index].expand;
    },
    handleClickParentMenu(item, index) {
      this.getExpandMenu(index);
      if (item.link === this.full_path) {
        return;
      }
      if (item.link) {
        this.$router.push({ path: `${item.link}` });
      }
    },
  },
};
</script>
<style scoped></style>
<style scoped>
.mainmenu .active-parent {
  border-left: 5px solid #f4d608;
  background-color: #0018ab;
  color: #ffffff;
}
.mainmenu .expand-parent {
  background-color: #0018ab;
  color: #ffffff;
}
.icon-style {
  color: #f4d608;
}
.submenu .active-child {
  border-left: 5px solid #f4d608;
  background-color: #cdd4fa;
  color: #0018ab;
}
/* define a fixed width for the entire menu */
.navigation {
  overflow: hidden;
  position: fixed;
  width: 256px;
  overflow-y: scroll;
  top: 80px;
  bottom: 0;
  background-color: #000060;
}

/* reset our lists to remove bullet points and padding */
.mainmenu,
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

/* make ALL links (main and submenu) have padding and background color */
.mainmenu a {
  display: block;
  background-color: #000060;
  text-decoration: none;
  padding: 15px;
  color: #b5b5b5;
}
.mainmenu p {
  padding: 10px;
}

/* add hover behaviour */
.mainmenu a:hover {
  border-left: 5px solid #f4d608;
  color: white;
  /* background-color: #C5C5C5; */
}

/* when hovering over a .mainmenu item,
  display the submenu inside it.
  we're changing the submenu's max-height from 0 to 200px;
*/

.mainmenu li:hover .submenu {
  display: block;
  /* max-height: 200px; */
}

/*
  we now overwrite the background-color for .submenu links only.
  CSS reads down the page, so code at the bottom will overwrite the code at the top.
*/

.submenu a {
  background-color: #e9f1ff;
  color: #505050;
}
/* hover behaviour for links inside .submenu */
/* .submenu a:hover {
  background-color: #666;
} */
.submenu a:hover {
  /* background-color: #C5C5C5; */
  border-left: 5px solid #f4d608;
  color: #0018ab;
}

/* this is the initial state of all submenus.
  we set it to max-height: 0, and hide the overflowed content.
*/
.submenu {
  overflow: hidden;
  max-height: 0;
  -webkit-transition: all 0.2s ease-out;
}
</style>
