import {info, warning} from '@actions/core'
import {ArtifactClient} from '@actions/artifact'
import {existsSync} from 'fs'
import {join} from 'path'

export async function uploadLog(
    mountedDirInHost: string,
    uploadClient: ArtifactClient
): Promise<void> {
    const abstractPath = join(mountedDirInHost, 'sauce-connect.log')
    if (!existsSync(abstractPath)) {
        warning(
            `No sauce-connect.log found in the temp directory ${mountedDirInHost}.`
        )
        return
    }

    info('Trying to upload the sauce-connect.log...')
    const uploadResult = await uploadClient.uploadArtifact(
        'source-connect-logs',
        [abstractPath],
        mountedDirInHost,
        {
            continueOnError: true
        }
    )
    info(
        `Uploaded the sauce-connect.log to artifact as ${uploadResult.artifactName}`
    )
}
