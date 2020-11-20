import {uploadLog} from '../src/upload-log'
import {promises} from 'fs'
import {tmpdir} from 'os'
import {join} from 'path'
import {
    ArtifactClient,
    create,
    UploadOptions,
    UploadResponse
} from '@actions/artifact'

async function touch(filepath: string) {
    const fileHandle = await promises.open(filepath, 'w')
    return fileHandle.close()
}

describe('uploadLog()', () => {
    let client: ArtifactClient
    let spy: jest.SpyInstance<
        Promise<UploadResponse>,
        [
            name: string,
            files: string[],
            rootDirectory: string,
            options?: UploadOptions
        ]
    >
    beforeEach(() => {
        client = create()
        spy = jest.spyOn(client, 'uploadArtifact')
        spy.mockImplementation(
            (
                name: string,
                files: string[],
                rootDirectory: string,
                options?: UploadOptions
            ) => {
                return Promise.resolve({
                    artifactName: 'source-connect-logs',
                    size: 1,
                    artifactItems: ['source-connect.log'],
                    failedItems: []
                })
            }
        )
    })
    it('uploads sauce-connect.log as an artifact', async () => {
        const dir = await promises.mkdtemp(
            join(tmpdir(), 'sauce-connect-action-test-')
        )
        touch(join(dir, 'sauce-connect.log'))

        await uploadLog(dir, client)
        expect(spy.mock.calls).toHaveLength(1)
    })
    it('skips operation if no sauce-connect.log exists', async () => {
        const dir = await promises.mkdtemp(
            join(tmpdir(), 'sauce-connect-action-test-')
        )

        await uploadLog(dir, client)
        expect(spy.mock.calls).toHaveLength(0)
    })
})
