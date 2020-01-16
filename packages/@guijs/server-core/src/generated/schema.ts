import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MetaCommand } from '@/schema/command/meta-types';
import { Context } from '@context';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
};

export type ChangeTerminalTitleInput = {
  id: Scalars['ID'],
  title: Scalars['String'],
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
  id: Scalars['ID']
};


export type MutationSelectFileArgs = {
  input: SelectFileInput
};

export type Project = {
   __typename?: 'Project',
  id: Scalars['ID'],
  name: Scalars['String'],
  path: Scalars['String'],
  bookmarked: Scalars['Boolean'],
  lastOpen?: Maybe<Scalars['Date']>,
  workspaces: Array<Workspace>,
};

export type ProjectType = {
   __typename?: 'ProjectType',
  id: Scalars['ID'],
  name: Scalars['String'],
  logo: Scalars['String'],
};

export type Query = {
   __typename?: 'Query',
  terminal?: Maybe<Terminal>,
  terminals: Array<Terminal>,
  searchCommands: Array<Command>,
  keybindings: Array<Keybinding>,
};


export type QueryTerminalArgs = {
  id: Scalars['ID']
};


export type QuerySearchCommandsArgs = {
  text: Scalars['String']
};

export type SelectFileInput = {
  cwd?: Maybe<Scalars['String']>,
  directory?: Maybe<Scalars['Boolean']>,
};

export type Subscription = {
   __typename?: 'Subscription',
  commandRan?: Maybe<Command>,
};

export type Terminal = {
   __typename?: 'Terminal',
  id: Scalars['ID'],
  name: Scalars['String'],
  title: Scalars['String'],
  cwd: Scalars['String'],
};

export type Workspace = {
   __typename?: 'Workspace',
  id: Scalars['ID'],
  name: Scalars['String'],
  relativePath: Scalars['String'],
  type: ProjectType,
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
  Mutation: ResolverTypeWrapper<{}>,
  CreateTerminalInput: CreateTerminalInput,
  ChangeTerminalTitleInput: ChangeTerminalTitleInput,
  SelectFileInput: SelectFileInput,
  Subscription: ResolverTypeWrapper<{}>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  Project: ResolverTypeWrapper<Project>,
  Workspace: ResolverTypeWrapper<Workspace>,
  ProjectType: ResolverTypeWrapper<ProjectType>,
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
  Mutation: {},
  CreateTerminalInput: CreateTerminalInput,
  ChangeTerminalTitleInput: ChangeTerminalTitleInput,
  SelectFileInput: SelectFileInput,
  Subscription: {},
  Date: Scalars['Date'],
  Project: Project,
  Workspace: Workspace,
  ProjectType: ProjectType,
};

export type CommandResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Command'] = ResolversParentTypes['Command']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['CommandType'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  keybinding?: Resolver<Maybe<ResolversTypes['Keybinding']>, ParentType, ContextType>,
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
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
  runCommand?: Resolver<Maybe<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<MutationRunCommandArgs, 'id'>>,
  selectFile?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSelectFileArgs, 'input'>>,
};

export type ProjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  bookmarked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  lastOpen?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  workspaces?: Resolver<Array<ResolversTypes['Workspace']>, ParentType, ContextType>,
};

export type ProjectTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProjectType'] = ResolversParentTypes['ProjectType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  logo?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  terminal?: Resolver<Maybe<ResolversTypes['Terminal']>, ParentType, ContextType, RequireFields<QueryTerminalArgs, 'id'>>,
  terminals?: Resolver<Array<ResolversTypes['Terminal']>, ParentType, ContextType>,
  searchCommands?: Resolver<Array<ResolversTypes['Command']>, ParentType, ContextType, RequireFields<QuerySearchCommandsArgs, 'text'>>,
  keybindings?: Resolver<Array<ResolversTypes['Keybinding']>, ParentType, ContextType>,
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  commandRan?: SubscriptionResolver<Maybe<ResolversTypes['Command']>, "commandRan", ParentType, ContextType>,
};

export type TerminalResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Terminal'] = ResolversParentTypes['Terminal']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  cwd?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type WorkspaceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Workspace'] = ResolversParentTypes['Workspace']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  relativePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ProjectType'], ParentType, ContextType>,
};

export type Resolvers<ContextType = Context> = {
  Command?: CommandResolvers<ContextType>,
  Date?: GraphQLScalarType,
  Keybinding?: KeybindingResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Project?: ProjectResolvers<ContextType>,
  ProjectType?: ProjectTypeResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Terminal?: TerminalResolvers<ContextType>,
  Workspace?: WorkspaceResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
