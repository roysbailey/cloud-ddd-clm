<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="cloud-ddd-clm" generation="1" functional="0" release="0" Id="80cbb3af-9de3-4b4e-bd8e-dc249adb8e08" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="cloud-ddd-clmGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="CLMUI:EndpointWebUI" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/LB:CLMUI:EndpointWebUI" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="CLMUI:AZURE_STORAGE_ACCESS_KEY" defaultValue="">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapCLMUI:AZURE_STORAGE_ACCESS_KEY" />
          </maps>
        </aCS>
        <aCS name="CLMUI:AZURE_STORAGE_ACCOUNT" defaultValue="">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapCLMUI:AZURE_STORAGE_ACCOUNT" />
          </maps>
        </aCS>
        <aCS name="CLMUIInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapCLMUIInstances" />
          </maps>
        </aCS>
        <aCS name="PollOrgChangesRole:AZURE_STORAGE_ACCESS_KEY" defaultValue="">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapPollOrgChangesRole:AZURE_STORAGE_ACCESS_KEY" />
          </maps>
        </aCS>
        <aCS name="PollOrgChangesRole:AZURE_STORAGE_ACCOUNT" defaultValue="">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapPollOrgChangesRole:AZURE_STORAGE_ACCOUNT" />
          </maps>
        </aCS>
        <aCS name="PollOrgChangesRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapPollOrgChangesRoleInstances" />
          </maps>
        </aCS>
        <aCS name="ProcessOrgChangeRole:AZURE_STORAGE_ACCESS_KEY" defaultValue="">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapProcessOrgChangeRole:AZURE_STORAGE_ACCESS_KEY" />
          </maps>
        </aCS>
        <aCS name="ProcessOrgChangeRole:AZURE_STORAGE_ACCOUNT" defaultValue="">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapProcessOrgChangeRole:AZURE_STORAGE_ACCOUNT" />
          </maps>
        </aCS>
        <aCS name="ProcessOrgChangeRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/MapProcessOrgChangeRoleInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:CLMUI:EndpointWebUI">
          <toPorts>
            <inPortMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUI/EndpointWebUI" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapCLMUI:AZURE_STORAGE_ACCESS_KEY" kind="Identity">
          <setting>
            <aCSMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUI/AZURE_STORAGE_ACCESS_KEY" />
          </setting>
        </map>
        <map name="MapCLMUI:AZURE_STORAGE_ACCOUNT" kind="Identity">
          <setting>
            <aCSMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUI/AZURE_STORAGE_ACCOUNT" />
          </setting>
        </map>
        <map name="MapCLMUIInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUIInstances" />
          </setting>
        </map>
        <map name="MapPollOrgChangesRole:AZURE_STORAGE_ACCESS_KEY" kind="Identity">
          <setting>
            <aCSMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/PollOrgChangesRole/AZURE_STORAGE_ACCESS_KEY" />
          </setting>
        </map>
        <map name="MapPollOrgChangesRole:AZURE_STORAGE_ACCOUNT" kind="Identity">
          <setting>
            <aCSMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/PollOrgChangesRole/AZURE_STORAGE_ACCOUNT" />
          </setting>
        </map>
        <map name="MapPollOrgChangesRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/PollOrgChangesRoleInstances" />
          </setting>
        </map>
        <map name="MapProcessOrgChangeRole:AZURE_STORAGE_ACCESS_KEY" kind="Identity">
          <setting>
            <aCSMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/ProcessOrgChangeRole/AZURE_STORAGE_ACCESS_KEY" />
          </setting>
        </map>
        <map name="MapProcessOrgChangeRole:AZURE_STORAGE_ACCOUNT" kind="Identity">
          <setting>
            <aCSMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/ProcessOrgChangeRole/AZURE_STORAGE_ACCOUNT" />
          </setting>
        </map>
        <map name="MapProcessOrgChangeRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/ProcessOrgChangeRoleInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="CLMUI" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-clm\local_package.csx\roles\CLMUI" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="768" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="EndpointWebUI" protocol="http" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="AZURE_STORAGE_ACCESS_KEY" defaultValue="" />
              <aCS name="AZURE_STORAGE_ACCOUNT" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;CLMUI&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;CLMUI&quot;&gt;&lt;e name=&quot;EndpointWebUI&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;PollOrgChangesRole&quot; /&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot; /&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUIInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUIUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUIFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
        <groupHascomponents>
          <role name="PollOrgChangesRole" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-clm\local_package.csx\roles\PollOrgChangesRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <settings>
              <aCS name="AZURE_STORAGE_ACCESS_KEY" defaultValue="" />
              <aCS name="AZURE_STORAGE_ACCOUNT" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;PollOrgChangesRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;CLMUI&quot;&gt;&lt;e name=&quot;EndpointWebUI&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;PollOrgChangesRole&quot; /&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot; /&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/PollOrgChangesRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/PollOrgChangesRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/PollOrgChangesRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
        <groupHascomponents>
          <role name="ProcessOrgChangeRole" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-clm\local_package.csx\roles\ProcessOrgChangeRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <settings>
              <aCS name="AZURE_STORAGE_ACCESS_KEY" defaultValue="" />
              <aCS name="AZURE_STORAGE_ACCOUNT" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;ProcessOrgChangeRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;CLMUI&quot;&gt;&lt;e name=&quot;EndpointWebUI&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;PollOrgChangesRole&quot; /&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot; /&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/ProcessOrgChangeRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/ProcessOrgChangeRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/ProcessOrgChangeRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="CLMUIUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyUpdateDomain name="ProcessOrgChangeRoleUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyUpdateDomain name="PollOrgChangesRoleUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="CLMUIFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyFaultDomain name="PollOrgChangesRoleFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyFaultDomain name="ProcessOrgChangeRoleFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="CLMUIInstances" defaultPolicy="[1,1,1]" />
        <sCSPolicyID name="PollOrgChangesRoleInstances" defaultPolicy="[1,1,1]" />
        <sCSPolicyID name="ProcessOrgChangeRoleInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="3b2e6315-24b5-441d-9acb-815ba7ffc84b" ref="Microsoft.RedDog.Contract\ServiceContract\cloud-ddd-clmContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="4ad0936d-2b65-44ee-a237-91033f197576" ref="Microsoft.RedDog.Contract\Interface\CLMUI:EndpointWebUI@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/cloud-ddd-clm/cloud-ddd-clmGroup/CLMUI:EndpointWebUI" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>