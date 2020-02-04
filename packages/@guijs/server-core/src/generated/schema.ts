import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MetaDocument } from '@/schema/db/meta-types';
import { MetaCommand } from '@/schema/command/meta-types';
import { MetaSetting } from '@/schema/setting/meta-types';
import { MetaProject, MetaProjectWorkspace } from '@/schema/project/meta-types';
import { MetaProjectPackage } from '@/schema/pkg/meta-types';
import { MetaNpmScript } from '@/schema/script/meta-types';
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

export type CreateTerminalInput = {
  name: Scalars['String'],
  title: Scalars['String'],
  cwd?: Maybe<Scalars['String']>,
  hidden: Scalars['Boolean'],
};


export type Document = {
  id: Scalars['ID'],
};

export type ImportProjectInput = {
  path: Scalars['String'],
  name: Scalars['String'],
  bookmarked?: Maybe<Scalars['Boolean']>,
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
  checkImportProject: CheckProjectPayload,
  importProject: Project,
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


export type MutationCheckImportProjectArgs = {
  path: Scalars['String']
};


export type MutationImportProjectArgs = {
  input: ImportProjectInput
};


export type MutationUpdateSettingArgs = {
  input: UpdateSettingInput
};

export type NpmScript = Document & {
   __typename?: 'NpmScript',
  id: Scalars['ID'],
  name: Scalars['String'],
  command: Scalars['String'],
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

export type ProjectPackage = {
   __typename?: 'ProjectPackage',
  id: Scalars['ID'],
  metadataId?: Maybe<Scalars['ID']>,
  type: ProjectPackageType,
  projectTypes: Array<ProjectType>,
  versionSelector: Scalars['String'],
  isWorkspace?: Maybe<Scalars['Boolean']>,
  official?: Maybe<Scalars['Boolean']>,
  description?: Maybe<Scalars['String']>,
  defaultLogo?: Maybe<Scalars['String']>,
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
  projectType?: Maybe<ProjectType>,
  projects: Array<Project>,
  project?: Maybe<Project>,
  recentProjectCommands: Array<Command>,
  settings: Array<Setting>,
  setting?: Maybe<Setting>,
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


export type QueryProjectTypeArgs = {
  id: Scalars['ID']
};


export type QueryProjectArgs = {
  id: Scalars['ID']
};


export type QuerySettingArgs = {
  id: Scalars['ID']
};

export type RunCommandInput = {
  id: Scalars['ID'],
  payload?: Maybe<Scalars['JSON']>,
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

export type Subscription = {
   __typename?: 'Subscription',
  commandRan?: Maybe<CommandRan>,
  settingUpdated?: Maybe<Setting>,
};


export type SubscriptionSettingUpdatedArgs = {
  id: Scalars['ID']
};

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
  ProjectType: ResolverTypeWrapper<ProjectType>,
  Project: ResolverTypeWrapper<MetaProject>,
  Document: ResolverTypeWrapper<MetaDocument>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  ProjectWorkspace: ResolverTypeWrapper<MetaProjectWorkspace>,
  ProjectPackage: ResolverTypeWrapper<MetaProjectPackage>,
  ProjectPackageType: ProjectPackageType,
  NpmScript: ResolverTypeWrapper<MetaNpmScript>,
  Setting: ResolverTypeWrapper<MetaSetting>,
  SettingCategory: ResolverTypeWrapper<SettingCategory>,
  JSON: ResolverTypeWrapper<Scalars['JSON']>,
  Mutation: ResolverTypeWrapper<{}>,
  CreateTerminalInput: CreateTerminalInput,
  ChangeTerminalTitleInput: ChangeTerminalTitleInput,
  RunCommandInput: RunCommandInput,
  SelectFileInput: SelectFileInput,
  CheckProjectPayload: ResolverTypeWrapper<CheckProjectPayload>,
  ImportProjectInput: ImportProjectInput,
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
  ProjectType: ProjectType,
  Project: MetaProject,
  Document: MetaDocument,
  Date: Scalars['Date'],
  ProjectWorkspace: MetaProjectWorkspace,
  ProjectPackage: MetaProjectPackage,
  ProjectPackageType: ProjectPackageType,
  NpmScript: MetaNpmScript,
  Setting: MetaSetting,
  SettingCategory: SettingCategory,
  JSON: Scalars['JSON'],
  Mutation: {},
  CreateTerminalInput: CreateTerminalInput,
  ChangeTerminalTitleInput: ChangeTerminalTitleInput,
  RunCommandInput: RunCommandInput,
  SelectFileInput: SelectFileInput,
  CheckProjectPayload: CheckProjectPayload,
  ImportProjectInput: ImportProjectInput,
  UpdateSettingInput: UpdateSettingInput,
  Subscription: {},
  CommandRan: Omit<CommandRan, 'command'> & { command: ResolversParentTypes['Command'] },
};

export type CheckProjectPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CheckProjectPayload'] = ResolversParentTypes['CheckProjectPayload']> = {
  packageName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type CommandResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Command'] = ResolversParentTypes['Command']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['CommandType'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  keybinding?: Resolver<Maybe<ResolversTypes['Keybinding']>, ParentType, ContextType>,
};

export type CommandRanResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommandRan'] = ResolversParentTypes['CommandRan']> = {
  command?: Resolver<ResolversTypes['Command'], ParentType, ContextType>,
  payload?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
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
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createTerminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<MutationCreateTerminalArgs, 'input'>>,
  changeTerminalTitle?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<MutationChangeTerminalTitleArgs, 'input'>>,
  removeTerminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<MutationRemoveTerminalArgs, 'id'>>,
  runCommand?: Resolver<Maybe<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<MutationRunCommandArgs, 'input'>>,
  selectFile?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSelectFileArgs, 'input'>>,
  checkImportProject?: Resolver<ResolversTypes['CheckProjectPayload'], ParentType, ContextType, RequireFields<MutationCheckImportProjectArgs, 'path'>>,
  importProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationImportProjectArgs, 'input'>>,
  updateSetting?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType, RequireFields<MutationUpdateSettingArgs, 'input'>>,
};

export type NpmScriptResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NpmScript'] = ResolversParentTypes['NpmScript']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  command?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type ProjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  bookmarked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  lastOpen?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  workspaces?: Resolver<Array<ResolversTypes['ProjectWorkspace']>, ParentType, ContextType>,
  workspace?: Resolver<Maybe<ResolversTypes['ProjectWorkspace']>, ParentType, ContextType, RequireFields<ProjectWorkspaceArgs, 'id'>>,
};

export type ProjectPackageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectPackage'] = ResolversParentTypes['ProjectPackage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  metadataId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ProjectPackageType'], ParentType, ContextType>,
  projectTypes?: Resolver<Array<ResolversTypes['ProjectType']>, ParentType, ContextType>,
  versionSelector?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isWorkspace?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  official?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  defaultLogo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type ProjectTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectType'] = ResolversParentTypes['ProjectType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  logo?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type ProjectWorkspaceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectWorkspace'] = ResolversParentTypes['ProjectWorkspace']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  absolutePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  relativePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ProjectType'], ParentType, ContextType>,
  packages?: Resolver<Array<ResolversTypes['ProjectPackage']>, ParentType, ContextType>,
  scripts?: Resolver<Array<ResolversTypes['NpmScript']>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  terminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<QueryTerminalArgs, 'id'>>,
  terminals?: Resolver<Array<ResolversTypes['Terminal']>, ParentType, ContextType>,
  searchCommands?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<QuerySearchCommandsArgs, 'text'>>,
  command?: Resolver<Maybe<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<QueryCommandArgs, 'id'>>,
  commandShortcuts?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType>,
  keybindings?: Resolver<Array<ResolversTypes['Keybinding']>, ParentType, ContextType>,
  keybinding?: Resolver<Maybe<ResolversTypes['Keybinding']>, ParentType, ContextType, RequireFields<QueryKeybindingArgs, 'id'>>,
  projectType?: Resolver<Maybe<ResolversTypes['ProjectType']>, ParentType, ContextType, RequireFields<QueryProjectTypeArgs, 'id'>>,
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>,
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>,
  recentProjectCommands?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType>,
  settings?: Resolver<Array<ResolversTypes['Setting']>, ParentType, ContextType>,
  setting?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType, RequireFields<QuerySettingArgs, 'id'>>,
};

export type SettingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Setting'] = ResolversParentTypes['Setting']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  category?: Resolver<ResolversTypes['SettingCategory'], ParentType, ContextType>,
  value?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
};

export type SettingCategoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SettingCategory'] = ResolversParentTypes['SettingCategory']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  commandRan?: SubscriptionResolver<Maybe<ResolversTypes['CommandRan']>, "commandRan", ParentType, ContextType>,
  settingUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Setting']>, "settingUpdated", ParentType, ContextType, RequireFields<SubscriptionSettingUpdatedArgs, 'id'>>,
};

export type TerminalResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Terminal'] = ResolversParentTypes['Terminal']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  cwd?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
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
  Project?: ProjectResolvers<ContextType>,
  ProjectPackage?: ProjectPackageResolvers<ContextType>,
  ProjectType?: ProjectTypeResolvers<ContextType>,
  ProjectWorkspace?: ProjectWorkspaceResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Setting?: SettingResolvers<ContextType>,
  SettingCategory?: SettingCategoryResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Terminal?: TerminalResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
