import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MetaDocument } from '@/schema/db/meta-types';
import { MetaCommand } from '@/schema/command/meta-types';
import { MetaSetting } from '@/schema/setting/meta-types';
import { MetaProject, MetaProjectWorkspace } from '@/schema/project/meta-types';
import { MetaProjectPackage, MetaPackageMetadata } from '@/schema/pkg/meta-types';
import { MetaNpmScript } from '@/schema/script/meta-types';
import { MetaProjectGenerator } from '@/schema/project-type/meta-types';
import { Context } from '@context';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
  JSON: any,
};

export type ChangeTerminalTitleInput = {
  id: Scalars['ID'],
  title: Scalars['String'],
};

export type CheckProjectPayload = {
   __typename?: 'CheckProjectPayload',
  packageName?: Maybe<Scalars['String']>,
};

export type Command = {
   __typename?: 'Command',
  id: Scalars['ID'],
  type: CommandType,
  label: Scalars['String'],
  icon?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  keybinding?: Maybe<Keybinding>,
};

export type CommandRan = {
   __typename?: 'CommandRan',
  command: Command,
  payload?: Maybe<Scalars['JSON']>,
};

export enum CommandType {
  Help = 'help',
  Action = 'action',
  Project = 'project',
  Package = 'package',
  Config = 'config',
  Script = 'script'
}

export type CreateProjectInput = {
  monorepo: Scalars['Boolean'],
  name: Scalars['String'],
  baseFolder: Scalars['String'],
  simpleProject?: Maybe<CreateSimpleProjectInput>,
};

export type CreateProjectWorkspaceInput = {
  name: Scalars['String'],
  projectGeneratorId: Scalars['ID'],
};

export type CreateSimpleProjectInput = {
  projectGeneratorId: Scalars['ID'],
};

export type CreateTerminalInput = {
  name: Scalars['String'],
  title: Scalars['String'],
  cwd?: Maybe<Scalars['String']>,
  hidden: Scalars['Boolean'],
};


export type Document = {
  id: Scalars['ID'],
};

export type EditNpmScriptInput = {
  scriptId: Scalars['ID'],
  command: Scalars['String'],
};

export type EditProjectWorkspaceInput = {
  projectId: Scalars['ID'],
  workspaceId: Scalars['ID'],
  name: Scalars['String'],
  typeId: Scalars['ID'],
};

export type ImportProjectInput = {
  path: Scalars['String'],
  name: Scalars['String'],
  bookmarked?: Maybe<Scalars['Boolean']>,
};

export type InstallPackageInput = {
  packageName: Scalars['String'],
  workspaceId: Scalars['String'],
  dev: Scalars['Boolean'],
  versionSelector?: Maybe<Scalars['String']>,
};


export type Keybinding = {
   __typename?: 'Keybinding',
  id: Scalars['ID'],
  description?: Maybe<Scalars['String']>,
  sequences: Array<Scalars['String']>,
  scope: Scalars['String'],
  global?: Maybe<Scalars['Boolean']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createTerminal?: Maybe<Terminal>,
  changeTerminalTitle?: Maybe<Terminal>,
  removeTerminal?: Maybe<Terminal>,
  runCommand?: Maybe<Command>,
  selectFile?: Maybe<Scalars['String']>,
  installPackage?: Maybe<Task>,
  createProject?: Maybe<Task>,
  createProjectWorkspace?: Maybe<Task>,
  checkImportProject: CheckProjectPayload,
  importProject: Project,
  editProjectWorkspace?: Maybe<ProjectWorkspace>,
  editNpmScript: NpmScript,
  renameNpmScript: NpmScript,
  runScript?: Maybe<NpmScript>,
  stopScript?: Maybe<NpmScript>,
  updateSetting?: Maybe<Setting>,
};


export type MutationCreateTerminalArgs = {
  input: CreateTerminalInput
};


export type MutationChangeTerminalTitleArgs = {
  input: ChangeTerminalTitleInput
};


export type MutationRemoveTerminalArgs = {
  id: Scalars['ID']
};


export type MutationRunCommandArgs = {
  input: RunCommandInput
};


export type MutationSelectFileArgs = {
  input: SelectFileInput
};


export type MutationInstallPackageArgs = {
  input: InstallPackageInput
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput
};


export type MutationCreateProjectWorkspaceArgs = {
  input: CreateProjectWorkspaceInput
};


export type MutationCheckImportProjectArgs = {
  path: Scalars['String']
};


export type MutationImportProjectArgs = {
  input: ImportProjectInput
};


export type MutationEditProjectWorkspaceArgs = {
  input: EditProjectWorkspaceInput
};


export type MutationEditNpmScriptArgs = {
  input: EditNpmScriptInput
};


export type MutationRenameNpmScriptArgs = {
  input: RenameNpmScriptInput
};


export type MutationRunScriptArgs = {
  input: RunScriptInput
};


export type MutationStopScriptArgs = {
  input: StopScriptInput
};


export type MutationUpdateSettingArgs = {
  input: UpdateSettingInput
};

export type NpmScript = Document & {
   __typename?: 'NpmScript',
  id: Scalars['ID'],
  name: Scalars['String'],
  command: Scalars['String'],
  status: NpmScriptStatus,
  terminal?: Maybe<Terminal>,
};

export enum NpmScriptStatus {
  Idle = 'idle',
  Running = 'running',
  Success = 'success',
  Error = 'error',
  Killed = 'killed'
}

export type PackageMetadata = {
   __typename?: 'PackageMetadata',
  id: Scalars['ID'],
  awesomejsId?: Maybe<Scalars['ID']>,
  projectTypes: Array<ProjectType>,
  official?: Maybe<Scalars['Boolean']>,
  description?: Maybe<Scalars['String']>,
  defaultLogo?: Maybe<Scalars['String']>,
  latestVersion?: Maybe<Scalars['String']>,
  versionTags: Array<PackageVersionTag>,
  versions: Array<Scalars['String']>,
};

export type PackageVersionTag = {
   __typename?: 'PackageVersionTag',
  tag: Scalars['String'],
  version: Scalars['String'],
};

export type Project = Document & {
   __typename?: 'Project',
  id: Scalars['ID'],
  name: Scalars['String'],
  path: Scalars['String'],
  bookmarked: Scalars['Boolean'],
  lastOpen?: Maybe<Scalars['Date']>,
  workspaces: Array<ProjectWorkspace>,
  workspace?: Maybe<ProjectWorkspace>,
};


export type ProjectWorkspaceArgs = {
  id: Scalars['ID']
};

export type ProjectGenerator = {
   __typename?: 'ProjectGenerator',
  id: Scalars['ID'],
  name: Scalars['String'],
  projectType: ProjectType,
  packageName?: Maybe<Scalars['String']>,
};

export type ProjectPackage = {
   __typename?: 'ProjectPackage',
  id: Scalars['ID'],
  type: ProjectPackageType,
  versionSelector: Scalars['String'],
  metadata: PackageMetadata,
  isWorkspace?: Maybe<Scalars['Boolean']>,
  currentVersion?: Maybe<Scalars['String']>,
};

export enum ProjectPackageType {
  Main = 'main',
  Dev = 'dev'
}

export type ProjectType = {
   __typename?: 'ProjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  slug: Scalars['String'],
  logo: Scalars['String'],
};

export type ProjectWorkspace = {
   __typename?: 'ProjectWorkspace',
  id: Scalars['ID'],
  name: Scalars['String'],
  absolutePath: Scalars['String'],
  relativePath: Scalars['String'],
  type: ProjectType,
  packages: Array<ProjectPackage>,
  scripts: Array<NpmScript>,
};

export type Query = {
   __typename?: 'Query',
  terminal?: Maybe<Terminal>,
  terminals: Array<Terminal>,
  searchCommands: Array<Command>,
  command?: Maybe<Command>,
  commandShortcuts: Array<Command>,
  keybindings: Array<Keybinding>,
  keybinding?: Maybe<Keybinding>,
  packageMetadata?: Maybe<PackageMetadata>,
  projectGenerators: Array<ProjectGenerator>,
  projectTypes: Array<ProjectType>,
  projectType?: Maybe<ProjectType>,
  projects: Array<Project>,
  project?: Maybe<Project>,
  recentProjects: Array<Project>,
  bookmarkedProjects: Array<Project>,
  recentProjectCommands: Array<Command>,
  script?: Maybe<NpmScript>,
  settings: Array<Setting>,
  setting?: Maybe<Setting>,
  task?: Maybe<Task>,
  tasks: Array<Task>,
};


export type QueryTerminalArgs = {
  id: Scalars['ID']
};


export type QuerySearchCommandsArgs = {
  text: Scalars['String']
};


export type QueryCommandArgs = {
  id: Scalars['ID']
};


export type QueryKeybindingArgs = {
  id: Scalars['ID']
};


export type QueryPackageMetadataArgs = {
  id: Scalars['ID']
};


export type QueryProjectTypeArgs = {
  id: Scalars['ID']
};


export type QueryProjectArgs = {
  id: Scalars['ID']
};


export type QueryScriptArgs = {
  id: Scalars['ID']
};


export type QuerySettingArgs = {
  id: Scalars['ID']
};


export type QueryTaskArgs = {
  id: Scalars['ID']
};

export type RenameNpmScriptInput = {
  scriptId: Scalars['ID'],
  name: Scalars['String'],
};

export type RunCommandInput = {
  id: Scalars['ID'],
  payload?: Maybe<Scalars['JSON']>,
};

export type RunScriptInput = {
  scriptId: Scalars['ID'],
};

export type SelectFileInput = {
  cwd?: Maybe<Scalars['String']>,
  directory?: Maybe<Scalars['Boolean']>,
};

export type Setting = {
   __typename?: 'Setting',
  id: Scalars['ID'],
  label: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  category: SettingCategory,
  value?: Maybe<Scalars['JSON']>,
};

export type SettingCategory = {
   __typename?: 'SettingCategory',
  id: Scalars['ID'],
  label: Scalars['String'],
};

export type StopScriptInput = {
  scriptId: Scalars['ID'],
};

export type Subscription = {
   __typename?: 'Subscription',
  commandRan?: Maybe<CommandRan>,
  projectPackageAdded: ProjectPackage,
  packageMetadataUpdated?: Maybe<PackageMetadata>,
  projectWorkspaceAdded: ProjectWorkspace,
  npmScriptUpdated?: Maybe<NpmScript>,
  settingUpdated?: Maybe<Setting>,
  taskAdded: Task,
  taskUpdated: Task,
};


export type SubscriptionProjectPackageAddedArgs = {
  projectId?: Maybe<Scalars['ID']>,
  workspaceId?: Maybe<Scalars['ID']>
};


export type SubscriptionProjectWorkspaceAddedArgs = {
  projectId?: Maybe<Scalars['ID']>
};


export type SubscriptionSettingUpdatedArgs = {
  id: Scalars['ID']
};

export type Task = {
   __typename?: 'Task',
  id: Scalars['ID'],
  type: Scalars['ID'],
  payload?: Maybe<Scalars['JSON']>,
  status: TaskStatus,
  progress?: Maybe<Scalars['Float']>,
  message?: Maybe<Scalars['String']>,
};

export enum TaskStatus {
  Running = 'running',
  Success = 'success',
  Error = 'error'
}

export type Terminal = {
   __typename?: 'Terminal',
  id: Scalars['ID'],
  name: Scalars['String'],
  title: Scalars['String'],
  cwd: Scalars['String'],
};

export type UpdateSettingInput = {
  id: Scalars['ID'],
  value?: Maybe<Scalars['JSON']>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Terminal: ResolverTypeWrapper<Terminal>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Command: ResolverTypeWrapper<MetaCommand>,
  CommandType: CommandType,
  Keybinding: ResolverTypeWrapper<Keybinding>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  PackageMetadata: ResolverTypeWrapper<MetaPackageMetadata>,
  ProjectType: ResolverTypeWrapper<ProjectType>,
  PackageVersionTag: ResolverTypeWrapper<PackageVersionTag>,
  ProjectGenerator: ResolverTypeWrapper<MetaProjectGenerator>,
  Project: ResolverTypeWrapper<MetaProject>,
  Document: ResolverTypeWrapper<MetaDocument>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  ProjectWorkspace: ResolverTypeWrapper<MetaProjectWorkspace>,
  ProjectPackage: ResolverTypeWrapper<MetaProjectPackage>,
  ProjectPackageType: ProjectPackageType,
  NpmScript: ResolverTypeWrapper<MetaNpmScript>,
  NpmScriptStatus: NpmScriptStatus,
  Setting: ResolverTypeWrapper<MetaSetting>,
  SettingCategory: ResolverTypeWrapper<SettingCategory>,
  JSON: ResolverTypeWrapper<Scalars['JSON']>,
  Task: ResolverTypeWrapper<Task>,
  TaskStatus: TaskStatus,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Mutation: ResolverTypeWrapper<{}>,
  CreateTerminalInput: CreateTerminalInput,
  ChangeTerminalTitleInput: ChangeTerminalTitleInput,
  RunCommandInput: RunCommandInput,
  SelectFileInput: SelectFileInput,
  InstallPackageInput: InstallPackageInput,
  CreateProjectInput: CreateProjectInput,
  CreateSimpleProjectInput: CreateSimpleProjectInput,
  CreateProjectWorkspaceInput: CreateProjectWorkspaceInput,
  CheckProjectPayload: ResolverTypeWrapper<CheckProjectPayload>,
  ImportProjectInput: ImportProjectInput,
  EditProjectWorkspaceInput: EditProjectWorkspaceInput,
  EditNpmScriptInput: EditNpmScriptInput,
  RenameNpmScriptInput: RenameNpmScriptInput,
  RunScriptInput: RunScriptInput,
  StopScriptInput: StopScriptInput,
  UpdateSettingInput: UpdateSettingInput,
  Subscription: ResolverTypeWrapper<{}>,
  CommandRan: ResolverTypeWrapper<Omit<CommandRan, 'command'> & { command: ResolversTypes['Command'] }>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Scalars['ID'],
  Terminal: Terminal,
  String: Scalars['String'],
  Command: MetaCommand,
  CommandType: CommandType,
  Keybinding: Keybinding,
  Boolean: Scalars['Boolean'],
  PackageMetadata: MetaPackageMetadata,
  ProjectType: ProjectType,
  PackageVersionTag: PackageVersionTag,
  ProjectGenerator: MetaProjectGenerator,
  Project: MetaProject,
  Document: MetaDocument,
  Date: Scalars['Date'],
  ProjectWorkspace: MetaProjectWorkspace,
  ProjectPackage: MetaProjectPackage,
  ProjectPackageType: ProjectPackageType,
  NpmScript: MetaNpmScript,
  NpmScriptStatus: NpmScriptStatus,
  Setting: MetaSetting,
  SettingCategory: SettingCategory,
  JSON: Scalars['JSON'],
  Task: Task,
  TaskStatus: TaskStatus,
  Float: Scalars['Float'],
  Mutation: {},
  CreateTerminalInput: CreateTerminalInput,
  ChangeTerminalTitleInput: ChangeTerminalTitleInput,
  RunCommandInput: RunCommandInput,
  SelectFileInput: SelectFileInput,
  InstallPackageInput: InstallPackageInput,
  CreateProjectInput: CreateProjectInput,
  CreateSimpleProjectInput: CreateSimpleProjectInput,
  CreateProjectWorkspaceInput: CreateProjectWorkspaceInput,
  CheckProjectPayload: CheckProjectPayload,
  ImportProjectInput: ImportProjectInput,
  EditProjectWorkspaceInput: EditProjectWorkspaceInput,
  EditNpmScriptInput: EditNpmScriptInput,
  RenameNpmScriptInput: RenameNpmScriptInput,
  RunScriptInput: RunScriptInput,
  StopScriptInput: StopScriptInput,
  UpdateSettingInput: UpdateSettingInput,
  Subscription: {},
  CommandRan: Omit<CommandRan, 'command'> & { command: ResolversParentTypes['Command'] },
};

export type CheckProjectPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CheckProjectPayload'] = ResolversParentTypes['CheckProjectPayload']> = {
  packageName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CommandResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Command'] = ResolversParentTypes['Command']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['CommandType'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  keybinding?: Resolver<Maybe<ResolversTypes['Keybinding']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CommandRanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommandRan'] = ResolversParentTypes['CommandRan']> = {
  command?: Resolver<ResolversTypes['Command'], ParentType, ContextType>,
  payload?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type DocumentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  __resolveType?: TypeResolveFn<'Project' | 'NpmScript', ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type KeybindingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Keybinding'] = ResolversParentTypes['Keybinding']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  sequences?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  scope?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  global?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createTerminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<MutationCreateTerminalArgs, 'input'>>,
  changeTerminalTitle?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<MutationChangeTerminalTitleArgs, 'input'>>,
  removeTerminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<MutationRemoveTerminalArgs, 'id'>>,
  runCommand?: Resolver<Maybe<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<MutationRunCommandArgs, 'input'>>,
  selectFile?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSelectFileArgs, 'input'>>,
  installPackage?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<MutationInstallPackageArgs, 'input'>>,
  createProject?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>,
  createProjectWorkspace?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<MutationCreateProjectWorkspaceArgs, 'input'>>,
  checkImportProject?: Resolver<ResolversTypes['CheckProjectPayload'], ParentType, ContextType, RequireFields<MutationCheckImportProjectArgs, 'path'>>,
  importProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationImportProjectArgs, 'input'>>,
  editProjectWorkspace?: Resolver<Maybe<ResolversTypes['ProjectWorkspace']>, ParentType, ContextType, RequireFields<MutationEditProjectWorkspaceArgs, 'input'>>,
  editNpmScript?: Resolver<ResolversTypes['NpmScript'], ParentType, ContextType, RequireFields<MutationEditNpmScriptArgs, 'input'>>,
  renameNpmScript?: Resolver<ResolversTypes['NpmScript'], ParentType, ContextType, RequireFields<MutationRenameNpmScriptArgs, 'input'>>,
  runScript?: Resolver<Maybe<ResolversTypes['NpmScript']>, ParentType, ContextType, RequireFields<MutationRunScriptArgs, 'input'>>,
  stopScript?: Resolver<Maybe<ResolversTypes['NpmScript']>, ParentType, ContextType, RequireFields<MutationStopScriptArgs, 'input'>>,
  updateSetting?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType, RequireFields<MutationUpdateSettingArgs, 'input'>>,
};

export type NpmScriptResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NpmScript'] = ResolversParentTypes['NpmScript']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  command?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['NpmScriptStatus'], ParentType, ContextType>,
  terminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type PackageMetadataResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageMetadata'] = ResolversParentTypes['PackageMetadata']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  awesomejsId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  projectTypes?: Resolver<Array<ResolversTypes['ProjectType']>, ParentType, ContextType>,
  official?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  defaultLogo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  latestVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  versionTags?: Resolver<Array<ResolversTypes['PackageVersionTag']>, ParentType, ContextType>,
  versions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type PackageVersionTagResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PackageVersionTag'] = ResolversParentTypes['PackageVersionTag']> = {
  tag?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  bookmarked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  lastOpen?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  workspaces?: Resolver<Array<ResolversTypes['ProjectWorkspace']>, ParentType, ContextType>,
  workspace?: Resolver<Maybe<ResolversTypes['ProjectWorkspace']>, ParentType, ContextType, RequireFields<ProjectWorkspaceArgs, 'id'>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProjectGeneratorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectGenerator'] = ResolversParentTypes['ProjectGenerator']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  projectType?: Resolver<ResolversTypes['ProjectType'], ParentType, ContextType>,
  packageName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProjectPackageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectPackage'] = ResolversParentTypes['ProjectPackage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ProjectPackageType'], ParentType, ContextType>,
  versionSelector?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  metadata?: Resolver<ResolversTypes['PackageMetadata'], ParentType, ContextType>,
  isWorkspace?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  currentVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProjectTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectType'] = ResolversParentTypes['ProjectType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  logo?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProjectWorkspaceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectWorkspace'] = ResolversParentTypes['ProjectWorkspace']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  absolutePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  relativePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ProjectType'], ParentType, ContextType>,
  packages?: Resolver<Array<ResolversTypes['ProjectPackage']>, ParentType, ContextType>,
  scripts?: Resolver<Array<ResolversTypes['NpmScript']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  terminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<QueryTerminalArgs, 'id'>>,
  terminals?: Resolver<Array<ResolversTypes['Terminal']>, ParentType, ContextType>,
  searchCommands?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<QuerySearchCommandsArgs, 'text'>>,
  command?: Resolver<Maybe<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<QueryCommandArgs, 'id'>>,
  commandShortcuts?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType>,
  keybindings?: Resolver<Array<ResolversTypes['Keybinding']>, ParentType, ContextType>,
  keybinding?: Resolver<Maybe<ResolversTypes['Keybinding']>, ParentType, ContextType, RequireFields<QueryKeybindingArgs, 'id'>>,
  packageMetadata?: Resolver<Maybe<ResolversTypes['PackageMetadata']>, ParentType, ContextType, RequireFields<QueryPackageMetadataArgs, 'id'>>,
  projectGenerators?: Resolver<Array<ResolversTypes['ProjectGenerator']>, ParentType, ContextType>,
  projectTypes?: Resolver<Array<ResolversTypes['ProjectType']>, ParentType, ContextType>,
  projectType?: Resolver<Maybe<ResolversTypes['ProjectType']>, ParentType, ContextType, RequireFields<QueryProjectTypeArgs, 'id'>>,
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>,
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>,
  recentProjects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>,
  bookmarkedProjects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>,
  recentProjectCommands?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType>,
  script?: Resolver<Maybe<ResolversTypes['NpmScript']>, ParentType, ContextType, RequireFields<QueryScriptArgs, 'id'>>,
  settings?: Resolver<Array<ResolversTypes['Setting']>, ParentType, ContextType>,
  setting?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType, RequireFields<QuerySettingArgs, 'id'>>,
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTaskArgs, 'id'>>,
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>,
};

export type SettingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Setting'] = ResolversParentTypes['Setting']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  category?: Resolver<ResolversTypes['SettingCategory'], ParentType, ContextType>,
  value?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type SettingCategoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SettingCategory'] = ResolversParentTypes['SettingCategory']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  commandRan?: SubscriptionResolver<Maybe<ResolversTypes['CommandRan']>, "commandRan", ParentType, ContextType>,
  projectPackageAdded?: SubscriptionResolver<ResolversTypes['ProjectPackage'], "projectPackageAdded", ParentType, ContextType, SubscriptionProjectPackageAddedArgs>,
  packageMetadataUpdated?: SubscriptionResolver<Maybe<ResolversTypes['PackageMetadata']>, "packageMetadataUpdated", ParentType, ContextType>,
  projectWorkspaceAdded?: SubscriptionResolver<ResolversTypes['ProjectWorkspace'], "projectWorkspaceAdded", ParentType, ContextType, SubscriptionProjectWorkspaceAddedArgs>,
  npmScriptUpdated?: SubscriptionResolver<Maybe<ResolversTypes['NpmScript']>, "npmScriptUpdated", ParentType, ContextType>,
  settingUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Setting']>, "settingUpdated", ParentType, ContextType, RequireFields<SubscriptionSettingUpdatedArgs, 'id'>>,
  taskAdded?: SubscriptionResolver<ResolversTypes['Task'], "taskAdded", ParentType, ContextType>,
  taskUpdated?: SubscriptionResolver<ResolversTypes['Task'], "taskUpdated", ParentType, ContextType>,
};

export type TaskResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  payload?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>,
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TerminalResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Terminal'] = ResolversParentTypes['Terminal']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  cwd?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = Context> = {
  CheckProjectPayload?: CheckProjectPayloadResolvers<ContextType>,
  Command?: CommandResolvers<ContextType>,
  CommandRan?: CommandRanResolvers<ContextType>,
  Date?: GraphQLScalarType,
  Document?: DocumentResolvers,
  JSON?: GraphQLScalarType,
  Keybinding?: KeybindingResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  NpmScript?: NpmScriptResolvers<ContextType>,
  PackageMetadata?: PackageMetadataResolvers<ContextType>,
  PackageVersionTag?: PackageVersionTagResolvers<ContextType>,
  Project?: ProjectResolvers<ContextType>,
  ProjectGenerator?: ProjectGeneratorResolvers<ContextType>,
  ProjectPackage?: ProjectPackageResolvers<ContextType>,
  ProjectType?: ProjectTypeResolvers<ContextType>,
  ProjectWorkspace?: ProjectWorkspaceResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Setting?: SettingResolvers<ContextType>,
  SettingCategory?: SettingCategoryResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Task?: TaskResolvers<ContextType>,
  Terminal?: TerminalResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
