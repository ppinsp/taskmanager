<template>
  <v-card class="pb-0 mb-0" max-width="100%" height="100%">
    <v-card-title class="title font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-avatar
        color="primary lighten-2"
        class="subheading white--text"
        size="24"
        v-text="step"
      ></v-avatar>
    </v-card-title>

    <v-window v-model="step">
      <!-- All Task  Page -->
      <v-window-item :value="1">
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" sm="6" md="8">
              <v-simple-table>
                <thead>
                  <tr>
                    <th class="text-left">
                      Project need YOU
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <td>
                    <template>
                      <v-expansion-panels focusable>
                        <v-expansion-panel v-for="(item, i) in data" :key="i">
                          <v-expansion-panel-header>
                            {{ item.name }}
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-card-text>
                              <v-layout row>
                                <v-flex>
                                  <v-card max-width="90%">
                                    <v-container fluid grid-list-lg>
                                      <v-layout row wrap>
                                        <v-flex xs12>
                                          <!-- create panel  -->

                                          <!-- Master card of Requirement -->
                                          <v-card v-for="(requirement, index) in item.requirements"
                                            :key="index"
                                            color="grey lighten-5"
                                            class="black--text"
                                          >
                                            <v-layout row>
                                              <v-flex xs6 >
                                                <v-card-text primary-title
                                                >
                                                  <div  >
                                                    
                                                     <p style="color: black">
                                                    {{ requirement.detail }}
                                                  </p>
                                                  </div>
                                                </v-card-text>
                                              </v-flex>
                                              <v-flex xs5>
                                                <div>frist name</div>
                                                <br />
                                                <div>
                                                  <v-chip :color="pink">
                                                    Statuspin
                                                  </v-chip>
                                                </div>
                                                <br />
                                                <v-icon>
                                                  mdi-folder-multiple-image
                                                </v-icon>
                                                <v-icon>
                                                  mdi-folder-edit
                                                </v-icon>
                                              </v-flex>
                                            </v-layout>
                                            <v-divider light></v-divider>
                                            <!-- Select user and Date -->
                                            <v-card-actions
                                            >
                                            <!-- <v-icon
                medium
                color=" grey darken-1"
                @click="addrequirementuser(item.team.id, requirement.id, requirement.user_id)"
                >mdi-account-multiple-plus</v-icon
              > -->
                                              <!-- Select user -->
                                              <v-select       
                                                @click="addrequirementuser(item.team.id, requirement.id, requirement.user_id)"                        
                                                v-model="selectedUser"
                                                :items="userlist"
                                                item-value="id"
                                                label="Choose Your Users"
                                                dense
                                                solo
                                              >
                                               <template slot="selection" slot-scope="{ item }">
                                                {{ item.firstName }} - {{ item.lastName }}
                                              </template>
                                              <template slot="item" slot-scope="{ item }">
                                                {{ item.firstName }} - {{ item.lastName }}
                                              </template>
                                              </v-select>
                                              <!-- End Select user -->
                                              <!-- Date -->
                                              <v-menu
                                                v-model="activeDate"
                                                :close-on-content-click="true"
                                                :nudge-right="40"
                                                transition="scale-transition"
                                                offset-y
                                                min-width="290px"
                                              >
                                                <template
                                                  v-slot:activator="{
                                                    on,
                                                    attrs,
                                                  }"
                                                >
                                                  <v-text-field
                                                    v-model="date"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    outlined
                                                    v-bind="attrs"
                                                    v-on="on"
                                                  ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                  v-model="date"
                                                ></v-date-picker>
                                              </v-menu>
                                              <!-- End Date -->
                                              <v-spacer> </v-spacer>

                                              <!-- comment -->
                                              <v-btn icon @click="show = !show">
                                                <v-icon>{{
                                                  show
                                                    ? "mdi-comment-text"
                                                    : "mdi-comment-text"
                                                }}</v-icon>
                                              </v-btn>
                                            </v-card-actions>
                                            <v-slide-y-transition>
                                              <v-card-text v-show="show">
                                                <!-- show Comment -->
                                                <v-data-table
                                                  :headers="headerComment"
                                                  :items="comments"
                                                  item-key="name"
                                                  hide-default-footer
                                                  class="elevation-1"
                                                  color="primary"
                                                >
                                                  <!-- <v-chip :color='orange'>
                                            {{ comment }}
                                          </v-chip> -->
                                                </v-data-table>
                                                <!-- Sent Comment -->
                                                <v-text-field
                                                  v-model="comment"
                                                  filled
                                                  clear-icon="mdi-send"
                                                  clearable
                                                  label="Sent comment"
                                                  type="text"
                                                  @click:clear="clearMessage"
                                                ></v-text-field>
                                              </v-card-text>
                                            </v-slide-y-transition>
                                            <!-- End comment -->
                                            <!-- End select user and Date -->
                                          </v-card>
                                          
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  </v-card>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </template>
                  </td>
                </tbody>
              </v-simple-table>
            </v-col>
              
            <!-- Table Shere Thing -->
            <v-col cols="6" md="4">
              <div>
                <v-data-table
                  :headers="headers"
                  :items="messages"
                  item-key="name"
                  hide-default-footer
                  class="elevation-1"
                >
                </v-data-table>
                <!-- sent message -->
                <v-simple-table>
                  <template>
                    <tr>
                      <v-text-field
                        v-model="message"
                        filled
                        clear-icon="mdi-send"
                        clearable
                        label="Sent message"
                        type="text"
                        @click:clear="sendMessage"
                      ></v-text-field>
                    </tr>
                  </template>
                </v-simple-table>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- Working area -->
      <v-window-item :value="2">
        <v-card-text>
          <div>
            <!-- Status Task -->
          </div>
        </v-card-text>
      </v-window-item>

      <!-- Customer Page -->
      <v-window-item :value="3">
        <div class="pa-4 text-center">
          Customer Review
        </div>
      </v-window-item>
    </v-window>
    <!-- Customer Page -->
    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--">
        Backddd
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="step === 3" color="primary" depressed @click="step++">
        Next
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ProjectProvider from "@/resources/ProjectProvider";
import RequirementProvider from "@/resources/RequirementProvider";
import UserProvider from "@/resources/UserProvider";
import { getUser } from "@/utils/js/Auth";
const projectService = new ProjectProvider();
const requirementService = new RequirementProvider();
const usersService = new UserProvider();
export default {
  data: () => ({
    step: 1,
    show: false,
    date: new Date().toISOString().substr(0, 10),
    menu2: false,
    search: "",
    ShereThing: "",
    searchText: "",
    data: "",
    projectuserfind: "",
    user: "",
    postList: [],
    dataId: "",
    dialog: false,
    userlist: [],
    team: 0,
    selectedUser: "",
    selectedRequirement: "",
    messages: [
      {
        message: "Hello is a message Data",
      },
    ],
    comments: [
      {
        comment: "it a comment Data",
      },
    ],
    password: "Password",
    message: " ",
    marker: true,
    iconIndex: 0,
    icons: [
      "mdi-emoticon",
      "mdi-emoticon-cool",
      "mdi-emoticon-dead",
      "mdi-emoticon-excited",
      "mdi-emoticon-happy",
      "mdi-emoticon-neutral",
      "mdi-emoticon-sad",
      "mdi-emoticon-tongue",
    ],
  }),

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "  ";
        case 2:
          return " Task Satatus ";
        default:
          return "Review by Customer";
      }
    },
    headers() {
      return [
        {
          text: "Shere THING",
          align: "start",
          sortable: false,
          value: "message",
        },
      ];
    },
    headerComment() {
      return [
        {
          text: "comments",
          align: "start",
          sortable: false,
          value: "comment",
        },
      ];
    },
    icon() {
      return this.icons[this.iconIndex];
    },
  },
  methods: {
     async getData() {
      // this.loading = true;
      try {
        //const query = `search=${this.searchText}`;
        // const { data } = await projectService.getAllProject(query);
        const { data } = await projectService.getProjectUserFind(this.user.sub);

        //console.log(this.user.sub)
        //console.log(data)
        this.data = data;
        //const { dataproject } = await projectService.getProjectById(12)
        console.log("show arr", this.data[1].team);
        //console.log(dataproject)
      } catch (err) {
        console.log(err);
      } finally {
        // this.loading = false;
      }
    },
      async dialogControl() {
      await this.addrequirementuser();
    },
    async addrequirementuser(id, requirement_id, user_id) {
      this.dialog = true;
      try {
        this.selectedRequirement = requirement_id;
        console.log('user_id', user_id)
        if (user_id) {
          this.selectedUser = user_id
        }
        const { data } = await usersService.getuserrequriement(id);
        this.userlist = data;
        console.log("team name", data);
      } catch (error) {
        console.error("error");
      } finally {
        // do nothing
      }
    },
     async getusersrequirement() {
      try {
        // const {data} = await usersService.getuserrequriement()
        //this.userlist = data;
        console.log("team id", this.team);
      } catch (error) {
        console.error("error");
      } finally {
        // do nothing
      }
    },
    addUser(id) {
      this.selectedUser = id;
    },
    async updateRequirement() {
      let isSelected = this.confirmUser()
      if(!isSelected) {
        return
      }
      const payload = {
        user: this.selectedUser,
      };
      const result = await requirementService.updateRequirement(
        this.selectedRequirement,
        payload
      );
      this.dialog = false
      this.$emit('update-requirement')
      console.log("result = ", result);
      this.selectedUser = ''
    },
    sendMessage() {
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++;
    },
  },
  mounted() {
    // this.getProject();
    this.user = getUser();
    this.getData();

    // console.log(this.user.sub)
  },
};
</script>
