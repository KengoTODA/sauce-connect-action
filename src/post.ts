import {info, warning, getState, setFailed} from '@actions/core'
import {exec} from '@actions/exec'
import {create} from '@actions/artifact'
import {uploadLog} from './upload-log'

async function stopContainer(containerId: string): Promise<void> {
    if (!containerId) {
        warning(
            'No container ID found in state. Assume that no container run in this workflow run.'
        )
        return
    }

    info(`Trying to stop the docker container with ID ${containerId}...`)
    await exec('docker', ['container', 'stop', containerId])
    info('Stopped the docker container successfully.')
}

async function run(): Promise<void> {
    const containerId = getState('containerId')
    const mountedDirInHost = getState('mountedDirInHost')
    const uploadClient = create()

    try {
        const stopContainerPromise = stopContainer(containerId)
        const uploadLogPromise = uploadLog(mountedDirInHost, uploadClient)
        await Promise.all([stopContainerPromise, uploadLogPromise])
    } catch (error) {
        setFailed(error.message)
    }
}

run()
