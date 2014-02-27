<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="cloud-ddd-cml" generation="1" functional="0" release="0" Id="8137e167-305c-4eeb-a1ae-3af69c571e56" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="cloud-ddd-cmlGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="CLMUI:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/LB:CLMUI:Endpoint1" />
          </inToChannel>
        </inPort>
        <inPort name="PollOrgChangesRole:HttpIn" protocol="tcp">
          <inToChannel>
            <lBChannelMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/LB:PollOrgChangesRole:HttpIn" />
          </inToChannel>
        </inPort>
        <inPort name="ProcessOrgChangeRole:HttpIn" protocol="tcp">
          <inToChannel>
            <lBChannelMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/LB:ProcessOrgChangeRole:HttpIn" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="CLMUIInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/MapCLMUIInstances" />
          </maps>
        </aCS>
        <aCS name="PollOrgChangesRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/MapPollOrgChangesRoleInstances" />
          </maps>
        </aCS>
        <aCS name="ProcessOrgChangeRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/MapProcessOrgChangeRoleInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:CLMUI:Endpoint1">
          <toPorts>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/CLMUI/Endpoint1" />
          </toPorts>
        </lBChannel>
        <lBChannel name="LB:PollOrgChangesRole:HttpIn">
          <toPorts>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/PollOrgChangesRole/HttpIn" />
          </toPorts>
        </lBChannel>
        <lBChannel name="LB:ProcessOrgChangeRole:HttpIn">
          <toPorts>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRole/HttpIn" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapCLMUIInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/CLMUIInstances" />
          </setting>
        </map>
        <map name="MapPollOrgChangesRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/PollOrgChangesRoleInstances" />
          </setting>
        </map>
        <map name="MapProcessOrgChangeRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="CLMUI" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-clm\local_package.csx\roles\CLMUI" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="768" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="8081" />
            </componentports>
            <settings>
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;CLMUI&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;CLMUI&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;PollOrgChangesRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/CLMUIInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/CLMUIUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/CLMUIFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
        <groupHascomponents>
          <role name="PollOrgChangesRole" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-clm\local_package.csx\roles\PollOrgChangesRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="HttpIn" protocol="tcp" portRanges="8080" />
            </componentports>
            <settings>
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;PollOrgChangesRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;CLMUI&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;PollOrgChangesRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/PollOrgChangesRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/PollOrgChangesRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/PollOrgChangesRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
        <groupHascomponents>
          <role name="ProcessOrgChangeRole" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-clm\local_package.csx\roles\ProcessOrgChangeRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="HttpIn" protocol="tcp" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;ProcessOrgChangeRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;CLMUI&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;PollOrgChangesRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleFaultDomains" />
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
    <implementation Id="9c7944b9-b85a-44b2-b561-2452fbb84537" ref="Microsoft.RedDog.Contract\ServiceContract\cloud-ddd-cmlContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="a6a7425a-c70c-4857-ba7c-1d59d3686000" ref="Microsoft.RedDog.Contract\Interface\CLMUI:Endpoint1@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/CLMUI:Endpoint1" />
          </inPort>
        </interfaceReference>
        <interfaceReference Id="659a15e7-0d25-4002-aa0e-2dc5cca26799" ref="Microsoft.RedDog.Contract\Interface\PollOrgChangesRole:HttpIn@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/PollOrgChangesRole:HttpIn" />
          </inPort>
        </interfaceReference>
        <interfaceReference Id="0607c71a-377b-4001-8e09-752569ec705a" ref="Microsoft.RedDog.Contract\Interface\ProcessOrgChangeRole:HttpIn@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRole:HttpIn" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>