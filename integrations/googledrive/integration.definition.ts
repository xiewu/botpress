import * as sdk from '@botpress/sdk'
import { sentry as sentryHelpers } from '@botpress/sdk-addons'
import filesReadonly from './bp_modules/files-readonly'
import {
  fileSchema,
  createFileArgSchema,
  updateFileArgSchema,
  uploadFileDataArgSchema,
  downloadFileDataArgSchema,
  listFoldersOutputSchema,
  listFilesOutputSchema,
  readFileArgSchema,
  listItemsInputSchema,
  deleteFileArgSchema,
  downloadFileDataOutputSchema,
  fileDeletedEventSchema,
  folderSchema,
  folderDeletedEventSchema,
  baseDiscriminatedFileSchema,
  fileChannelSchema,
} from './src/schemas'

export default new sdk.IntegrationDefinition({
  name: 'googledrive',
  title: 'Google Drive',
  description: 'Access and manage your Google Drive files from your bot.',
  version: '0.3.3',
  readme: 'hub.md',
  icon: 'icon.svg',
  configuration: {
    identifier: {
      linkTemplateScript: 'linkTemplate.vrl',
    },
    schema: sdk.z.object({}),
  },
  actions: {
    listFiles: {
      // TODO: Implement listable
      title: 'List Files',
      description: 'List files in Google Drive',
      input: {
        schema: listItemsInputSchema,
      },
      output: {
        schema: listFilesOutputSchema,
      },
    },
    listFolders: {
      // TODO: Implement listable
      title: 'List folders',
      description: 'List folders in Google Drive',
      input: {
        schema: listItemsInputSchema,
      },
      output: {
        schema: listFoldersOutputSchema,
      },
    },
    createFile: {
      // TODO: Implement creatable
      title: 'Create File',
      description: 'Create an empty file in Google Drive',
      input: {
        schema: createFileArgSchema,
      },
      output: {
        schema: fileSchema.describe('The file created in Google Drive'),
      },
    },
    readFile: {
      // TODO: Implement readable
      title: 'Read File',
      description: "Read a file's metadata in a Google Drive",
      input: {
        schema: readFileArgSchema,
      },
      output: {
        schema: fileSchema.describe('The file read from Google Drive'),
      },
    },
    updateFile: {
      // TODO: Implement updatable
      title: 'Update File',
      description: "Update a file's metadata in Google Drive",
      input: {
        schema: updateFileArgSchema,
      },
      output: {
        schema: fileSchema.describe('The file updated in Google Drive'),
      },
    },
    deleteFile: {
      // TODO: Implement deletable
      title: 'Delete File',
      description: 'Deletes a file in Google Drive',
      input: {
        schema: deleteFileArgSchema,
      },
      output: {
        schema: sdk.z.object({}),
      },
    },
    uploadFileData: {
      title: 'Upload file data',
      description: 'Upload data to a file in Google Drive',
      input: {
        schema: uploadFileDataArgSchema,
      },
      output: {
        schema: sdk.z.object({}),
      },
    },
    downloadFileData: {
      title: 'Download file data',
      description: 'Download data from a file in Google Drive',
      input: {
        schema: downloadFileDataArgSchema,
      },
      output: {
        schema: downloadFileDataOutputSchema,
      },
    },
    syncChannels: {
      title: 'Sync Channels',
      description: 'Sync channels for file change subscriptions',
      input: {
        schema: sdk.z.object({}),
      },
      output: {
        schema: sdk.z.object({}),
      },
    },
  },
  events: {
    fileCreated: {
      title: 'File Created',
      description: 'Triggered when a file is created in Google Drive',
      schema: fileSchema,
    },
    fileDeleted: {
      title: 'File Deleted',
      description: 'Triggered when a file is deleted in Google Drive',
      schema: fileDeletedEventSchema,
    },
    folderCreated: {
      title: 'Folder Created',
      description: 'Triggered when a folder is created in Google Drive',
      schema: folderSchema,
    },
    folderDeleted: {
      title: 'Folder Deleted',
      description: 'Triggered when a folder is deleted in Google Drive',
      schema: folderDeletedEventSchema,
    },
  },
  states: {
    configuration: {
      type: 'integration',
      schema: sdk.z.object({
        refreshToken: sdk.z
          .string()
          .title('Refresh token')
          .describe('The refresh token to use to authenticate with Google. It gets exchanged for a bearer token'),
      }),
    },
    filesCache: {
      type: 'integration',
      schema: sdk.z.object({
        filesCache: sdk.z
          .record(sdk.z.string(), baseDiscriminatedFileSchema)
          .title('Files cache')
          .describe('Map of known files'),
      }),
    },
    filesChannelsCache: {
      type: 'integration',
      schema: sdk.z.object({
        filesChannelsCache: sdk.z
          .record(sdk.z.string(), fileChannelSchema)
          .title('Files change subscription channels')
          .describe('Serialized set of channels for file change subscriptions'),
      }),
    },
  },
  secrets: {
    ...sentryHelpers.COMMON_SECRET_NAMES,
    CLIENT_ID: {
      description: 'The client ID in your Google Cloud Credentials',
    },
    CLIENT_SECRET: {
      description: 'The client secret associated with your client ID',
    },
    WEBHOOK_SECRET: {
      description: 'The secret used to sign webhook tokens. Should be a high-entropy string that only Botpress knows',
    },
    FILE_PICKER_API_KEY: {
      description: 'The API key used to access the Google Picker API',
    },
  },
}).extend(filesReadonly, ({}) => ({
  entities: {},
  actions: {
    listItemsInFolder: {
      name: 'filesReadonlyListItemsInFolder',
      attributes: { ...sdk.WELL_KNOWN_ATTRIBUTES.HIDDEN_IN_STUDIO },
    },
    transferFileToBotpress: {
      name: 'filesReadonlyTransferFileToBotpress',
      attributes: { ...sdk.WELL_KNOWN_ATTRIBUTES.HIDDEN_IN_STUDIO },
    },
  },
  events: {
    fileCreated: { name: 'filesReadonlyFileCreated' },
    fileUpdated: { name: 'filesReadonlyFileUpdated' },
    fileDeleted: { name: 'filesReadonlyFileDeleted' },
    folderDeletedRecursive: { name: 'filesReadonlyFolderDeletedRecursive' },
    aggregateFileChanges: { name: 'filesReadonlyAggregateFileChanges' },
  },
}))
